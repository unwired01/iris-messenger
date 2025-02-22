import { Event } from 'nostr-tools';
import { bench, describe } from 'vitest';

import RBSortedMap from '@/utils/RBSortedMap';
import SortedMap from '@/utils/SortedMap';

import events from './events.json';

describe('SortedMap Write Benchmark', () => {
  bench(
    'Array-based SortedMap',
    () => {
      const sortedEvents = new SortedMap<string, Event>();
      events.forEach((event) => {
        sortedEvents.set(event.created_at + event.id, event);
      });
    },
    { iterations: 1000 },
  );

  bench(
    'Red-Black Tree SortedMap',
    () => {
      const sortedEvents = new RBSortedMap<string, Event>();
      events.forEach((event) => {
        sortedEvents.set(event.created_at + event.id, event);
      });
    },
    { iterations: 1000 },
  );
});

describe('SortedMap Write & Read Benchmark', () => {
  bench(
    'Array-based SortedMap',
    () => {
      const sortedEvents = new SortedMap<string, Event>();
      events.forEach((event) => {
        sortedEvents.set(event.created_at + event.id, event);
      });
      [...sortedEvents.values()].reverse();
    },
    { iterations: 1000 },
  );

  bench(
    'Red-Black Tree SortedMap',
    () => {
      const sortedEvents = new RBSortedMap<string, Event>();
      events.forEach((event) => {
        sortedEvents.set(event.created_at + event.id, event);
      });
      [...sortedEvents.values()].reverse();
    },
    { iterations: 1000 },
  );
});
