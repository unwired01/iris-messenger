import iris from 'iris-lib';
import { debounce, isEqual } from 'lodash';

import { Event, Filter, getEventHash, Relay, relayInit, signEvent, Sub } from './lib/nostr-tools';
const bech32 = require('bech32-buffer');
import localForage from 'localforage';

import SortedLimitedEventSet from './SortedLimitedEventSet';

declare global {
  interface Window {
    nostr: any;
  }
}

const getRelayStatus = (relay: Relay) => {
  // workaround for nostr-tools bug
  try {
    return relay.status;
  } catch (e) {
    return 3;
  }
};

const saveLocalStorageEvents = debounce((_this: any) => {
  const latestMsgs = _this.latestNotesByFollows.eventIds.slice(0, 500).map((eventId: any) => {
    return _this.messagesById.get(eventId);
  });
  const latestMsgsByEveryone = _this.latestNotesByEveryone.eventIds
    .slice(0, 1000)
    .map((eventId: any) => {
      return _this.messagesById.get(eventId);
    });
  console.log('saving some events to local storage');
  localForage.setItem('latestMsgs', latestMsgs);
  localForage.setItem('latestMsgsByEveryone', latestMsgsByEveryone);
}, 5000);

const saveLocalStorageProfilesAndFollows = debounce((_this) => {
  const profileEvents = Array.from(_this.profileEventByUser.values());
  const followEvents = Array.from(_this.followEventByUser.values());
  console.log('saving', profileEvents.length + followEvents.length, 'events to local storage');
  localForage.setItem('profileEvents', profileEvents);
  localForage.setItem('followEvents', followEvents);
}, 5000);

const MAX_MSGS_BY_USER = 500;
const MAX_LATEST_MSGS = 500;

const defaultRelays = new Map<string, Relay>(
  [
    'wss://jiggytom.ddns.net',
    'wss://nostr-relay.wlvs.space',
    'wss://nostr.fmt.wiz.biz',
    'wss://nostr.ono.re',
    'wss://relay.damus.io',
    'wss://nostr-pub.wellorder.net',
    'wss://relay.nostr.info',
    'wss://nostr.bitcoiner.social',
    'wss://nostr.onsats.org',
    'wss://nostr.mom',
  ].map((url) => [url, relayInit(url)]),
);

type Subscription = {
  filters: Filter[];
  callback?: (event: Event) => void;
};

let subscriptionId = 0;

export default {
  localStorageLoaded: false,
  profile: {},
  profiles: new Map<string, any>(),
  followedByUser: new Map<string, Set<string>>(),
  followersByUser: new Map<string, Set<string>>(),
  maxRelays: 4,
  relays: defaultRelays,
  subscriptionsByName: new Map<string, Set<Sub>>(),
  subscribedFiltersByName: new Map<string, Filter[]>(),
  subscriptions: new Map<number, Subscription>(),
  knownUsers: new Set<string>(),
  subscribedUsers: new Set<string>(),
  subscribedPosts: new Set<string>(),
  subscribedRepliesAndLikes: new Set<string>(),
  likesByUser: new Map<string, SortedLimitedEventSet>(),
  postsByUser: new Map<string, SortedLimitedEventSet>(),
  postsAndRepliesByUser: new Map<string, SortedLimitedEventSet>(),
  messagesById: new Map<string, Event>(),
  latestNotesByEveryone: new SortedLimitedEventSet(MAX_LATEST_MSGS),
  latestNotesByFollows: new SortedLimitedEventSet(MAX_LATEST_MSGS),
  profileEventByUser: new Map<string, Event>(),
  followEventByUser: new Map<string, Event>(),
  threadRepliesByMessageId: new Map<string, Set<string>>(),
  directRepliesByMessageId: new Map<string, Set<string>>(),
  likesByMessageId: new Map<string, Set<string>>(),
  handledMsgsPerSecond: 0,

  arrayToHex(array: any) {
    return Array.from(array, (byte: any) => {
      return ('0' + (byte & 0xff).toString(16)).slice(-2);
    }).join('');
  },

  follow: function (address: string) {
    address = this.toNostrHexAddress(address);
    const pubkey = iris.session.getKey().secp256k1.rpub;
    this.addFollower(address, pubkey);

    const event: Event = {
      kind: 3,
      created_at: Math.round(Date.now() / 1000),
      content: '',
      pubkey,
      tags: Array.from(this.followedByUser.get(pubkey)).map((address: string) => {
        return ['p', address];
      }),
    };

    this.publish(event);
  },

  loadLocalStorageEvents: async function () {
    const latestMsgs = await localForage.getItem('latestMsgs');
    const latestMsgsByEveryone = await localForage.getItem('latestMsgsByEveryone');
    const followEvents = await localForage.getItem('followEvents');
    const profileEvents = await localForage.getItem('profileEvents');
    this.localStorageLoaded = true;
    console.log('loaded from local storage');
    console.log('latestMsgs', latestMsgs);
    console.log('followEvents', followEvents);
    console.log('profileEvents', profileEvents);
    if (Array.isArray(followEvents)) {
      followEvents.forEach((e) => this.handleEvent(e));
    }
    if (Array.isArray(profileEvents)) {
      profileEvents.forEach((e) => this.handleEvent(e));
    }
    if (Array.isArray(latestMsgs)) {
      console.log('loaded latestmsgs');
      latestMsgs.forEach((msg) => {
        this.handleEvent(msg);
      });
    }
    if (Array.isArray(latestMsgsByEveryone)) {
      console.log('loaded latestMsgsByEveryone');
      latestMsgsByEveryone.forEach((msg) => {
        this.handleEvent(msg);
      });
    }
  },
  addRelay(url: string) {
    if (this.relays.has(url)) return;

    this.relays.set(url, relayInit(url));
  },
  removeRelay(url: string) {
    this.relays.get(url)?.close();
    this.relays.delete(url);
  },
  addFollower: function (address: string, follower: string) {
    if (!this.followersByUser.has(address)) {
      this.followersByUser.set(address, new Set<string>());
    }
    this.knownUsers.add(address);
    this.knownUsers.add(follower);
    this.followersByUser.get(address)?.add(follower);

    if (!this.followedByUser.has(follower)) {
      this.followedByUser.set(follower, new Set<string>());
    }
    const myPub = iris.session.getKey().secp256k1.rpub;

    // if new follow, move all their posts to followedByUser
    if (follower === myPub && !this.followedByUser.get(myPub).has(address)) {
      const posts = this.postsByUser.get(address);
      if (posts) {
        posts.eventIds.forEach((eventId) => {
          const event = this.messagesById.get(eventId);
          event && this.latestNotesByFollows.add(event);
        });
      }
    }
    this.followedByUser.get(follower)?.add(address);
    if (follower === myPub) {
      iris.public().get('follow').get(address).put(true);
      this.getPostsAndRepliesByUser(address);
    }
    if (address === myPub) {
      if (this.followersByUser.get(address)?.size === 1) {
        iris.local().get('hasNostrFollowers').put(true);
      }
    }
    if (this.followedByUser.get(myPub)?.has(follower)) {
      if (!this.subscribedUsers.has(address)) {
        this.subscribedUsers.add(address); // subscribe to events from 2nd degree follows
        this.subscribeToAuthors(this);
      }
    }
  },
  // TODO subscription methods for followersByUser and followedByUser. and maybe messagesByTime. and replies
  followerCount: function (address: string) {
    return this.followersByUser.get(address)?.size ?? 0;
  },
  toNostrBech32Address: function (address: string, prefix) {
    try {
      const decoded = bech32.decode(address);
      console.log(decoded);
      if (prefix !== decoded.prefix) {
        return null;
      }
      return bech32.encode(prefix, decoded.data);
    } catch (e) {}

    if (address.match(/^[0-9a-fA-F]{64}$/)) {
      const words = Buffer.from(address, 'hex');
      return bech32.encode(prefix, words);
    }
    return null;
  },
  toNostrHexAddress(str: string): string | null {
    if (str.match(/^[0-9a-fA-F]{64}$/)) {
      return str;
    }
    try {
      const { data } = bech32.decode(str);
      const addr = this.arrayToHex(data);
      return addr;
    } catch (e) {}
    return null;
  },
  publish: async function (event: any) {
    event.tags = event.tags || [];
    event.content = event.content || '';
    event.created_at = event.created_at || Math.floor(Date.now() / 1000);
    event.pubkey = iris.session.getKey().secp256k1.rpub;
    event.id = getEventHash(event);
    if (!event.sig) {
      const myPriv = iris.session.getKey().secp256k1.priv;
      if (myPriv) {
        event.sig = await signEvent(event, myPriv);
      } else if (window.nostr) {
        event = await window.nostr.signEvent(event);
      } else {
        alert('no nostr extension to sign the event with');
      }
      if (!(event.id && event.sig)) {
        console.error('Failed to sign event', event);
        throw new Error('Invalid event');
      }
    }
    for (const relay of this.relays.values()) {
      relay.publish(event);
    }
    this.handleEvent(event);
    return event.id;
  },
  sendSubToRelays: function (filters: Filter[], id: string, once = false) {
    // if subs with same id already exists, remove them
    if (id) {
      // TODO: remove from subscribedFilters
      const subs = this.subscriptionsByName.get(id);
      if (subs) {
        subs.forEach((sub) => {
          console.log('unsub', id);
          sub.unsub();
        });
      }
      this.subscriptionsByName.delete(id);
    }

    this.subscribedFiltersByName.set(id, filters);

    for (const relay of this.relays.values()) {
      const sub = relay.sub(filters, {});
      // TODO update relay lastSeen
      sub.on('event', (event) => this.handleEvent(event));
      if (once) {
        sub.on('eose', () => sub.unsub());
      }
      if (id) {
        if (!this.subscriptionsByName.has(id)) {
          this.subscriptionsByName.set(id, new Set());
        }
        this.subscriptionsByName.get(id)?.add(sub);
      }
    }
  },
  subscribeToRepliesAndLikes: debounce((_this) => {
    console.log('subscribeToRepliesAndLikes', _this.subscribedRepliesAndLikes);
    _this.sendSubToRelays(
      [{ kinds: [1, 7], '#e': Array.from(_this.subscribedRepliesAndLikes.values()) }],
      'subscribedRepliesAndLikes',
      true,
    );
  }, 500),
  // TODO we shouldn't bang the history queries all the time. only ask a users history once per relay.
  // then we can increase the limit
  subscribeToAuthors: debounce((_this) => {
    const now = Math.floor(Date.now() / 1000);
    const myPub = iris.session.getKey().secp256k1.rpub;
    const followedUsers = Array.from(_this.followedByUser.get(myPub) ?? []);
    followedUsers.push(myPub);
    const otherSubscribedUsers = Array.from(_this.subscribedUsers).filter(
      (u) => !followedUsers.includes(u),
    );
    console.log('subscribe to', followedUsers, otherSubscribedUsers);
    _this.sendSubToRelays(
      [{ kinds: [0, 3], until: now, authors: followedUsers }],
      'followed',
      true,
    );
    setTimeout(() => {
      _this.sendSubToRelays(
        [{ kinds: [0, 3], until: now, authors: otherSubscribedUsers }],
        'other',
        true,
      );
    }, 500);
    setTimeout(() => {
      _this.sendSubToRelays(
        [{ authors: followedUsers, limit: 500, until: now }],
        'followedHistory',
        true,
      );
    }, 1000);
    setTimeout(() => {
      _this.sendSubToRelays(
        [{ authors: otherSubscribedUsers, limit: 500, until: now }],
        'otherHistory',
        true,
      );
    }, 1500);
  }, 1000),
  subscribeToPosts: debounce((_this) => {
    if (_this.subscribedPosts.size === 0) return;
    console.log('subscribe to posts', Array.from(_this.subscribedPosts));
    _this.sendSubToRelays([{ ids: Array.from(_this.subscribedPosts) }], 'posts');
  }, 100),
  subscribe: function (filters: Filter[], cb: Function | undefined) {
    cb &&
      this.subscriptions.set(subscriptionId++, {
        filters,
        callback: cb,
      });

    let hasNewAuthors = false;
    let hasNewIds = false;
    let hasNewReplyAndLikeSubs = false;
    for (const filter of filters) {
      if (filter.authors) {
        for (const author of filter.authors) {
          // make sure the author is valid hex
          if (!author.match(/^[0-9a-fA-F]{64}$/)) {
            console.error('Invalid author', author);
            continue;
          }
          if (!this.subscribedUsers.has(author)) {
            hasNewAuthors = true;
            this.subscribedUsers.add(author);
          }
        }
      }
      if (filter.ids) {
        for (const id of filter.ids) {
          if (!this.subscribedPosts.has(id)) {
            hasNewIds = true;
            this.subscribedPosts.add(id);
          }
        }
      }
      if (Array.isArray(filter['#e'])) {
        for (const id of filter['#e']) {
          if (!this.subscribedRepliesAndLikes.has(id)) {
            hasNewReplyAndLikeSubs = true;
            this.subscribedRepliesAndLikes.add(id);
            setTimeout(() => {
              // remove after some time, so the requests don't grow too large
              this.subscribedRepliesAndLikes.delete(id);
            }, 60 * 1000);
          }
        }
      }
    }
    hasNewReplyAndLikeSubs && this.subscribeToRepliesAndLikes(this);
    hasNewAuthors && this.subscribeToAuthors(this);
    hasNewIds && this.subscribeToPosts(this);
  },
  getConnectedRelayCount: function () {
    let count = 0;
    for (const relay of this.relays.values()) {
      if (getRelayStatus(relay) === 1) {
        count++;
      }
    }
    return count;
  },
  SUGGESTED_FOLLOW: 'npub1xtscya34g58tk0z605fvr788k263gsu6cy9x0mhnm87echrgufzsevkk5s',
  connectRelay: function (relay: Relay) {
    relay.connect();
    relay.on('connect', () => {
      for (const filters of this.subscribedFiltersByName.values()) {
        relay.sub(filters, {});
      }
    });
    relay.on('notice', (notice) => {
      console.log('notice from ', relay.url, notice);
    });
  },
  manageRelays: function () {
    // TODO keep track of subscriptions and send them to new relays
    const go = () => {
      const relays: Array<Relay> = Array.from(this.relays.values());
      // ws status codes: https://developer.mozilla.org/en-US/docs/Web/API/CloseEvent
      const openRelays = relays.filter((relay: Relay) => getRelayStatus(relay) === 1);
      const connectingRelays = relays.filter((relay: Relay) => getRelayStatus(relay) === 0);
      if (openRelays.length + connectingRelays.length < this.maxRelays) {
        const closedRelays = relays.filter((relay: Relay) => getRelayStatus(relay) === 3);
        if (closedRelays.length) {
          const newRelay = relays[Math.floor(Math.random() * relays.length)];
          this.connectRelay(newRelay);
        }
      }
      if (openRelays.length > this.maxRelays) {
        openRelays[Math.floor(Math.random() * openRelays.length)].close();
      }
    };

    for (let i = 0; i < this.maxRelays; i++) {
      go();
    }

    setInterval(go, 1000);
  },
  handleNote(event: Event) {
    if (this.messagesById.has(event.id)) {
      return;
    }
    this.messagesById.set(event.id, event);
    if (!this.postsAndRepliesByUser.has(event.pubkey)) {
      this.postsAndRepliesByUser.set(event.pubkey, new SortedLimitedEventSet(MAX_MSGS_BY_USER));
    }
    this.postsAndRepliesByUser.get(event.pubkey)?.add(event);

    this.latestNotesByEveryone.add(event);
    const myPub = iris.session.getKey().secp256k1.rpub;
    if (event.pubkey === myPub || this.followedByUser.get(myPub)?.has(event.pubkey)) {
      const changed = this.latestNotesByFollows.add(event);
      if (changed && this.localStorageLoaded) {
        saveLocalStorageEvents(this); // TODO only save if was changed
      }
    }

    const replyingTo = this.getEventReplyingTo(event);
    if (replyingTo) {
      if (!this.directRepliesByMessageId.has(replyingTo)) {
        this.directRepliesByMessageId.set(replyingTo, new Set<string>());
      }
      this.directRepliesByMessageId.get(replyingTo)?.add(event.id);

      // are boost messages screwing this up?
      const repliedMsgs = event.tags
        .filter((tag) => tag[0] === 'e')
        .map((tag) => tag[1])
        .slice(0, 2);
      const myPub = iris.session.getKey().secp256k1.rpub;
      const isFollowed =
        event.pubkey === myPub || this.followedByUser.get(myPub)?.has(event.pubkey);
      for (const id of repliedMsgs) {
        if (isFollowed) {
          //this.getMessageById(id);
        }
        if (!this.threadRepliesByMessageId.has(id)) {
          this.threadRepliesByMessageId.set(id, new Set<string>());
        }
        this.threadRepliesByMessageId.get(id)?.add(event.id);
      }
    } else {
      if (!this.postsByUser.has(event.pubkey)) {
        this.postsByUser.set(event.pubkey, new SortedLimitedEventSet(MAX_MSGS_BY_USER));
      }
      this.postsByUser.get(event.pubkey)?.add(event);
    }
  },
  getEventReplyingTo: function (event: Event) {
    const replyTags = event.tags.filter((tag) => tag[0] === 'e');
    if (replyTags.length === 1) {
      return replyTags[0][1];
    }
    const replyTag = event.tags.find((tag) => tag[0] === 'e' && tag[3] === 'reply');
    if (replyTag) {
      return replyTag[1];
    }
    if (replyTags.length > 1) {
      return replyTags[1][1];
    }
    return undefined;
  },
  handleReaction(event: Event) {
    if (event.content !== '+' && event.content !== '') return; // for now we handle only likes
    const subjects = event.tags.filter((tag: any) => tag[0] === 'e');
    /*if (subjects.length > 1) {
      console.log('reaction with multiple subjects. what are these?', event);
    }*/
    for (const subject of subjects) {
      const id = subject[1];
      if (!this.likesByMessageId.has(id)) {
        this.likesByMessageId.set(id, new Set());
      }
      this.likesByMessageId.get(id).add(event.pubkey);

      if (!this.likesByUser.has(event.pubkey)) {
        this.likesByUser.set(event.pubkey, new SortedLimitedEventSet(MAX_MSGS_BY_USER));
      }
      this.likesByUser.get(event.pubkey).add({ id, created_at: event.created_at });
      const myPub = iris.session.getKey().secp256k1.rpub;
      if (event.pubkey === myPub || this.followedByUser.get(myPub)?.has(event.pubkey)) {
        //this.getMessageById(id);
      }
    }
  },
  handleFollow(event: Event) {
    for (const tag of event.tags) {
      if (Array.isArray(tag) && tag[0] === 'p') {
        this.addFollower(tag[1], event.pubkey);
      }
    }
    const myPub = iris.session.getKey().secp256k1.rpub;
    if (event.pubkey === myPub && event.tags.length) {
      iris.local().get('noFollows').put(false);
    }
    if (event.pubkey === myPub || this.followedByUser.get(myPub)?.has(event.pubkey)) {
      const existing = this.followEventByUser.get(event.pubkey);
      if (!existing || existing.created_at < event.created_at) {
        this.followEventByUser.set(event.pubkey, event);
        this.localStorageLoaded && saveLocalStorageProfilesAndFollows(this);
      }
    }
  },
  handleMetadata(event: Event) {
    try {
      const existing = this.profiles.get(event.pubkey);
      if (existing?.created_at >= event.created_at) {
        return;
      }
      const content = JSON.parse(event.content);
      const profile: any = { created_at: event.created_at };
      content.name && (profile.name = content.name);
      content.picture && (profile.photo = content.picture);
      content.about && (profile.about = content.about);
      if (content.iris) {
        try {
          const irisData = JSON.parse(content.iris);
          iris.Key.verify(irisData.sig, irisData.pub).then((nostrAddrSignedByIris) => {
            if (nostrAddrSignedByIris === event.pubkey) {
              profile.iris = irisData.pub;
            }
          });
        } catch (e) {
          // console.error('Invalid iris data', e);
        }
      }
      this.profiles.set(event.pubkey, profile);
      const key = this.toNostrBech32Address(event.pubkey, 'npub');
      iris.session.addToSearchIndex(key, {
        key,
        name: content.name,
        followers: this.followersByUser.get(event.pubkey) ?? new Set(),
      });
      const myPub = iris.session.getKey().secp256k1.rpub;
      //if (event.pubkey === myPub || this.followedByUser.get(myPub)?.has(event.pubkey)) {
      const existingEvent = this.profileEventByUser.get(event.pubkey);
      if (!existingEvent || existingEvent.created_at < event.created_at) {
        this.profileEventByUser.set(event.pubkey, event);
        this.localStorageLoaded && saveLocalStorageProfilesAndFollows(this);
      }
      //}
    } catch (e) {
      console.log('error parsing nostr profile', e);
    }
  },
  handleDelete(event: Event) {
    const id = event.tags.find((tag) => tag[0] === 'e')?.[1];
    if (id) {
      if (this.messagesById.has(id)) {
        this.postsAndRepliesByUser.get(event.pubkey)?.delete(id);
        // TODO remove from other places
      }
    }
  },
  handleEvent(event: Event) {
    if (!event) return;
    if (!this.knownUsers.has(event.pubkey) && !this.subscribedPosts.has(event.id)) {
      return;
    }
    this.handledMsgsPerSecond++;
    switch (event.kind) {
      case 0:
        this.handleMetadata(event);
        break;
      case 1:
        this.handleNote(event);
        break;
      case 5:
        this.handleDelete(event);
        break;
      case 3:
        this.handleFollow(event);
        break;
      case 7:
        this.handleReaction(event);
        break;
    }
    this.subscribedPosts.delete(event.id);
    // go through subscriptions and callback if filters match
    for (const sub of this.subscriptions.values()) {
      if (!sub.filters) {
        return;
      }
      if (this.matchesOneFilter(event, sub.filters)) {
        sub.callback && sub.callback(event);
      }
    }
  },
  // if one of the filters matches, return true
  matchesOneFilter(event: Event, filters: Filter[]) {
    for (const filter of filters) {
      if (this.matchFilter(event, filter)) {
        return true;
      }
    }
    return false;
  },
  matchFilter(event: Event, filter: Filter) {
    if (filter.ids && !filter.ids.includes(event.id)) {
      return false;
    }
    if (filter.kinds && !filter.kinds.includes(event.kind)) {
      return false;
    }
    if (filter.authors && !filter.authors.includes(event.pubkey)) {
      return false;
    }
    if (
      filter['#e'] &&
      !event.tags.some((tag: any) => tag[0] === 'e' && filter['#e'].includes(tag[1]))
    ) {
      return false;
    }
    if (
      filter['#p'] &&
      !event.tags.some((tag: any) => tag[0] === 'e' && filter['#p'].includes(tag[1]))
    ) {
      return false;
    }
    return true;
  },
  init: function () {
    iris
      .local()
      .get('loggedIn')
      .on(() => {
        const key = iris.session.getKey();
        this.knownUsers.add(key);
        this.manageRelays();
        this.loadLocalStorageEvents();
        this.getProfile(key.secp256k1.rpub, undefined);
        const hex = this.toNostrHexAddress(this.SUGGESTED_FOLLOW);
        this.knownUsers.add(hex);
        this.getProfile(this.toNostrHexAddress(hex), undefined);
        this.sendSubToRelays([{ kinds: [0, 1, 3, 7], limit: 200 }], 'new'); // everything new
        setTimeout(() => {
          this.sendSubToRelays([{ authors: [key.secp256k1.rpub] }], 'ours'); // our stuff
        }, 200);
        setInterval(() => {
          console.log('handled msgs per second', this.handledMsgsPerSecond);
          this.handledMsgsPerSecond = 0;
        }, 1000);

        iris
          .public()
          .get('profile')
          .get('name')
          .on(
            debounce((name, _k, msg) => {
              const updatedAt = msg.put['>'];
              if (
                !this.profile.name ||
                (this.profile.name.value !== name && this.profile.name.updatedAt < updatedAt)
              ) {
                this.profile.name = { value: name, updatedAt };
                this.setMetadata();
              }
            }, 1000),
          );
        iris
          .public()
          .get('profile')
          .get('about')
          .on(
            debounce((about, _k, msg) => {
              const updatedAt = msg.put['>'];
              if (
                !this.profile.about ||
                (this.profile.about.value !== about && this.profile.about.updatedAt < updatedAt)
              ) {
                this.profile.about = { value: about, updatedAt };
                this.setMetadata();
              }
            }, 1000),
          );
        iris
          .public()
          .get('profile')
          .get('photo')
          .on(
            debounce((photo, _k, msg) => {
              const updatedAt = msg.put['>'];
              if (
                !this.profile.picture ||
                (this.profile.picture.value !== photo && this.profile.picture.updatedAt < updatedAt)
              ) {
                this.profile.picture = { value: photo, updatedAt };
                this.setMetadata();
              }
            }, 1000),
          );
      });
  },

  getRepliesAndLikes(id: string, cb: Function | undefined) {
    const callback = () => {
      cb &&
        cb(
          this.directRepliesByMessageId.get(id),
          this.likesByMessageId.get(id),
          this.threadRepliesByMessageId.get(id)?.size ?? 0,
        );
    };
    if (this.directRepliesByMessageId.has(id) || this.likesByMessageId.has(id)) {
      callback();
    }

    this.subscribe([{ kinds: [1, 7], '#e': [id] }], callback);
  },
  getFollowedByUser: function (address: string, cb: Function | undefined) {
    const callback = () => {
      cb && cb(this.followedByUser.get(address));
    };
    if (this.followedByUser.has(address)) {
      callback();
    }
    this.subscribe([{ kinds: [3], authors: [address] }], callback);
  },
  getFollowersByUser: function (address: string, cb: Function | undefined) {
    const callback = () => {
      cb && cb(this.followersByUser.get(address));
    };
    if (this.followersByUser.has(address)) {
      callback();
    }
    this.subscribe([{ kinds: [3], '#p': [address] }], callback);
  },
  async getMessageById(id: string) {
    if (this.messagesById.has(id)) {
      return this.messagesById.get(id);
    }

    return new Promise((resolve) => {
      this.subscribe([{ ids: [id] }], () => {
        // TODO turn off subscription
        const msg = this.messagesById.get(id);
        msg && resolve(msg);
      });
    });
  },

  getSomeRelayUrl() {
    // try to find a connected relay, but if none are connected, just return the first one
    const relays: Relay[] = Array.from(this.relays.values());
    const connectedRelays: Relay[] = relays.filter((relay: Relay) => getRelayStatus(relay) === 1);
    if (connectedRelays.length) {
      return connectedRelays[0].url;
    }
    return relays.length ? relays[0].url : null;
  },

  getMessagesByEveryone(cb: Function) {
    const callback = () => {
      cb && cb(this.latestNotesByEveryone.eventIds);
    };
    callback();
    this.subscribe([{ kinds: [1, 5, 7] }], callback);
  },
  getMessagesByFollows(cb: Function) {
    const callback = () => {
      cb && cb(this.latestNotesByFollows.eventIds);
    };
    callback();
    this.subscribe([{ kinds: [1, 5, 7] }], callback);
  },
  getPostsAndRepliesByUser(address: string, cb: Function | undefined) {
    // TODO subscribe on view profile and unsub on leave profile
    if (!address) {
      return;
    }
    this.knownUsers.add(address);
    const callback = () => {
      cb && cb(this.postsAndRepliesByUser.get(address)?.eventIds);
    };
    if (this.postsAndRepliesByUser.has(address)) {
      callback();
    }
    this.subscribe([{ kinds: [1, 5, 7], authors: [address] }], callback);
  },
  getPostsByUser(address: string, cb: Function | undefined) {
    if (!address) {
      return;
    }
    this.knownUsers.add(address);
    const callback = () => {
      cb && cb(this.postsByUser.get(address)?.eventIds);
    };
    if (this.postsByUser.has(address)) {
      callback();
    }
    this.subscribe([{ kinds: [1, 5, 7], authors: [address] }], callback);
  },
  getLikesByUser(address: string, cb: Function | undefined) {
    if (!address) {
      return;
    }
    this.knownUsers.add(address);
    const callback = () => {
      cb && cb(this.likesByUser.get(address).eventIds);
    };
    if (this.likesByUser.has(address)) {
      callback();
    }
    this.subscribe([{ kinds: [7, 5], authors: [address] }], callback);
  },
  getProfile(address, cb: Function | undefined) {
    this.knownUsers.add(address);
    const callback = () => {
      const profile = this.profiles.get(address);
      cb && cb(profile, address);
    };
    if (this.profiles.has(address)) {
      callback();
    }

    this.subscribe([{ authors: [address], kinds: [0, 3] }], callback);
  },

  setMetadata() {
    if (!iris.session.getKey().secp256k1.priv) return;
    setTimeout(async () => {
      // for each child of this.profile, if it has a value, set it
      const irisData = JSON.stringify({
        pub: iris.session.getPubKey(),
        sig: await iris.Key.sign(iris.session.getKey().secp256k1.rpub, iris.session.getKey()),
      });
      const data = {
        iris: irisData,
      };
      for (const key in this.profile) {
        if (this.profile[key].value) {
          data[key] = this.profile[key].value;
        }
      }
      const event = {
        kind: 0,
        content: JSON.stringify(data),
      };

      this.publish(event);
    }, 1001);
  },
};
