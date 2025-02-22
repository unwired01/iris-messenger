import Dexie, { Table } from 'dexie';
import throttle from 'lodash/throttle';
import { Event, Filter } from 'nostr-tools';

import Events from './Events';
import Key from './Key';

// TODO: tags should be mapped to internal event ids in order to save space
type Tag = {
  id: string;
  eventId: string;
  type: string;
  value: string;
};

export class MyDexie extends Dexie {
  events!: Table<Event & { id: string }>;
  tags!: Table<Tag>;

  constructor() {
    super('iris');

    this.version(4).stores({
      events: 'id, pubkey, kind, created_at',
      tags: 'id, eventId, [type+value]',
    });
  }
}

const INITIAL_EVENT_LOAD_LIMIT = 5000;

const db = new MyDexie();

const handleEvent = (event: Event & { id: string }) => {
  /*😆*/
  requestAnimationFrame(() => {
    Events.handle(event, false, false);
  });
};

type SaveQueueEntry = {
  events: Event[];
  tags: Partial<Tag>[];
};

const IndexedDB = {
  db,
  subscribedEventIds: new Set<string>(),
  subscribedAuthors: new Set<string>(),
  subscribedTags: new Set<string>(),
  seenFilters: new Set<string>(),
  saveQueue: [] as SaveQueueEntry[],

  clear() {
    return db.delete();
  },

  save: throttle(async function (this: typeof IndexedDB) {
    const eventsToSave: any[] = [];
    const tagsToSave: any[] = [];
    for (const item of this.saveQueue) {
      eventsToSave.push(...item.events);
      tagsToSave.push(...item.tags);
    }
    this.saveQueue = [];
    try {
      await db.transaction('rw', db.events, db.tags, async () => {
        await db.events.bulkPut(eventsToSave);
        await db.tags.bulkPut(tagsToSave);
      });
    } catch (err) {
      console.error('bulkPut save error:', err);
    }
  }, 2000),

  saveEvent(event: Event & { id: string }) {
    const eventTags =
      event.tags
        ?.filter((tag) => tag[0] === 'e') // only save replies & reactions for now
        .map((tag) => ({
          id: event.id.slice(0, 16) + '-' + tag[0].slice(0, 16) + '-' + tag[1].slice(0, 16),
          eventId: event.id,
          type: tag[0],
          value: tag[1],
        })) || [];

    this.saveQueue.push({
      events: [event],
      tags: eventTags,
    });

    this.save();
  },
  async init() {
    const myPub = Key.getPubKey();

    await db.events.where({ pubkey: myPub }).each(handleEvent);
    await db.events.where({ kind: 3 }).each(handleEvent);
    await db.events.where({ kind: 0 }).each(handleEvent);
    await db.events.where({ kind: 4 }).each(handleEvent);
    await db.events
      .orderBy('created_at')
      .reverse()
      .filter((event) => event.kind === 1)
      .limit(INITIAL_EVENT_LOAD_LIMIT)
      .each(handleEvent);
  },

  subscribeToAuthors: throttle(async function (this: typeof IndexedDB, limit?: number) {
    const authors = [...this.subscribedAuthors];
    this.subscribedAuthors.clear();
    await db.events
      .where('pubkey')
      .anyOf(authors)
      .limit(limit || 1000)
      .each(handleEvent);
  }, 1000),

  subscribeToEventIds: throttle(async function (this: typeof IndexedDB) {
    const ids = [...this.subscribedEventIds];
    this.subscribedEventIds.clear();
    await db.events.where('id').anyOf(ids).each(handleEvent);
  }, 1000),

  subscribeToTags: throttle(async function (this: typeof IndexedDB) {
    const tagPairs = [...this.subscribedTags].map((tag) => tag.split('|')); // assuming you used '|' as delimiter
    this.subscribedTags.clear();
    await db.tags
      .where('[type+value]')
      .anyOf(tagPairs)
      .each((tag) => this.subscribedEventIds.add(tag.eventId));

    await this.subscribeToEventIds();
  }, 1000),

  async find(filter: Filter) {
    if (!filter) return;

    if (filter['#p']) return; // TODO save reactions & replies

    const stringifiedFilter = JSON.stringify(filter);
    if (this.seenFilters.has(stringifiedFilter)) return;
    this.seenFilters.add(stringifiedFilter);

    if (filter['#e'] && Array.isArray(filter['#e'])) {
      for (const eventId of filter['#e']) {
        this.subscribedTags.add('e|' + eventId);
      }

      await this.subscribeToTags();
      return;
    }

    if (filter.ids?.length) {
      filter.ids.forEach((id) => this.subscribedEventIds.add(id));
      await this.subscribeToEventIds();
      return;
    }

    if (filter.authors?.length) {
      filter.authors.forEach((author) => this.subscribedAuthors.add(author));
      await this.subscribeToAuthors();
      return;
    }

    let query: any = db.events;
    if (filter.kinds) {
      query = query.where('kind').anyOf(filter.kinds);
    }
    if (filter.limit) {
      query = query.limit(filter.limit);
    }
    await query.each(handleEvent);
  },
};

export default IndexedDB;
