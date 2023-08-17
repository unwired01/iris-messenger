import { Event, matchFilter } from 'nostr-tools';

import Filter from '@/nostr/Filter.ts';
import SortedMap from '@/utils/SortedMap';
import { ID, UID } from '@/utils/UniqueIds.ts';

export default class EventDB {
  private byId = new Map<UID, Event>();
  private byAuthor = new Map<UID, SortedMap<string, UID>>();
  private byKind = new Map<number, SortedMap<string, UID>>();

  get(id: any): Event | undefined {
    if (typeof id === 'string') {
      return this.byId.get(ID(id));
    }
  }

  add(event: Event): boolean {
    if (!event || !event.id || !event.created_at) {
      throw new Error('Invalid event');
    }

    const id = ID(event.id);
    if (this.byId.has(id)) {
      return false;
    }
    this.byId.set(id, event);

    const author = ID(event.pubkey);
    const indexKey = this.getIndexKey(event);

    this.mapAdd(this.byAuthor, author, indexKey, id);
    this.mapAdd(this.byKind, event.kind, indexKey, id);

    return true;
  }

  remove(eventId: string): void {
    const id = ID(eventId);
    const event = this.byId.get(id);

    if (event) {
      const author = ID(event.pubkey);
      const indexKey = this.getIndexKey(event);

      this.mapRemove(this.byAuthor, author, indexKey);
      this.mapRemove(this.byKind, event.kind, indexKey);

      this.byId.delete(id);
    }
  }

  find(filter: Filter, callback: (event: Event) => void): void {
    if (filter.ids) {
      for (const id of filter.ids) {
        const event = this.byId.get(ID(id));
        event && callback(event);
      }
    } else if (filter.authors) {
      this.iterateMap(filter.authors.map(ID), this.byAuthor, filter, callback);
    } else if (filter.kinds) {
      this.iterateMap(filter.kinds, this.byKind, filter, callback);
    }
  }

  findArray(filter: Filter): Event[] {
    const events: Event[] = [];
    const findArrayCallback = (event: Event) => {
      events.push(event);
    };
    this.find(filter, findArrayCallback);
    return events;
  }

  findAndRemove(filter: Filter) {
    if (filter.ids) {
      for (const id of filter.ids) {
        this.remove(id);
      }
    } else if (filter.authors) {
      this.iterateMap(filter.authors.map(ID), this.byAuthor, filter, (event) => {
        this.remove(event.id);
      });
    } else if (filter.kinds) {
      this.iterateMap(filter.kinds, this.byKind, filter, (event) => {
        this.remove(event.id);
      });
    }
  }

  findOne(filter: Filter): Event | undefined {
    let foundEvent: Event | undefined = undefined;

    const findOneCallback = (event: Event) => {
      if (!foundEvent) {
        foundEvent = event;
      }
    };

    this.find(filter, findOneCallback);

    return foundEvent;
  }

  private getIndexKey(event: Event): string {
    return event.created_at + event.id.slice(0, 16);
  }

  private mapAdd(map: Map<UID, SortedMap<string, UID>>, key: UID, indexKey: string, id: UID): void {
    if (!map.has(key)) {
      map.set(key, new SortedMap(undefined, 'desc'));
    }
    map.get(key)?.set(indexKey, id);
  }

  private mapRemove(map: Map<UID, SortedMap<string, UID>>, key: UID, indexKey: string): void {
    const sortedMap = map.get(key);
    if (sortedMap) {
      sortedMap.delete(indexKey);
      if (sortedMap.size === 0) {
        map.delete(key);
      }
    }
  }

  private iterateMap<KeyType>(
    keys: KeyType[],
    map: Map<KeyType, SortedMap<string, UID>>,
    filter: Filter,
    callback: (event: Event) => void,
  ): void {
    let count = 0;

    for (const key of keys) {
      const events = map.get(key);
      if (events) {
        for (const eventId of events.values()) {
          if (filter.limit !== undefined && count >= filter.limit) {
            return;
          }

          const event = this.byId.get(eventId);
          if (event && matchFilter(filter, event)) {
            callback(event);
            count++;
          }
        }
      }
    }
  }
}