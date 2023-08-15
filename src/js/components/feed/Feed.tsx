import { memo, useCallback, useEffect, useMemo, useRef, useState } from 'react';

import Image from '@/components/embed/Image';
import Video from '@/components/embed/Video';
import EventComponent from '@/components/events/EventComponent';
import DisplaySelector from '@/components/feed/DisplaySelector';
import FilterOptionsSelector from '@/components/feed/FilterOptionsSelector';
import ImageGridItem from '@/components/feed/ImageGridItem';
import ImageModal from '@/components/feed/ImageModal';
import ShowNewEvents from '@/components/feed/ShowNewEvents';
import { DisplayAs, FeedProps, ImageOrVideo } from '@/components/feed/types';
import InfiniteScroll from '@/components/helpers/InfiniteScroll.tsx';
import Show from '@/components/helpers/Show';
import useSubscribe from '@/hooks/useSubscribe';
import { useLocalState } from '@/LocalState';
import Events from '@/nostr/Events';
import Key from '@/nostr/Key.ts';

function extractMediaFromEvent(event: any): ImageOrVideo[] {
  const imageMatches = (event.content.match(Image.regex) || []).map((url: string) => ({
    type: 'image',
    url,
    created_at: event.created_at,
  }));
  const videoMatches = (event.content.match(Video.regex) || []).map((url: string) => ({
    type: 'video',
    url,
    created_at: event.created_at,
  }));
  return [...imageMatches, ...videoMatches];
}

function mapEventsToMedia(events: any[]): ImageOrVideo[] {
  return events.flatMap((event) => {
    if (event.kind === 7) {
      const taggedEventId = Events.getEventReplyingTo(event);
      if (taggedEventId) {
        Events.getEventById(taggedEventId, true); // TODO update on callback
        const taggedEvent = Events.db.by('id', taggedEventId);
        return taggedEvent ? extractMediaFromEvent(taggedEvent) : [];
      }
      return [];
    } else {
      return extractMediaFromEvent(event);
    }
  });
}

const DEFAULT_FETCH_EVENTS = (options) => {
  const { events, loadMore } = useSubscribe(options);
  return { events, loadMore };
};

const Feed = (props: FeedProps) => {
  const fetchEvents = props.fetchEvents || DEFAULT_FETCH_EVENTS;
  const feedTopRef = useRef<HTMLDivElement>(null);
  const { showDisplayAs, filterOptions, emptyMessage } = props;
  if (!filterOptions || filterOptions.length === 0) {
    throw new Error('Feed requires at least one filter option');
  }
  const [filterOption, setFilterOption] = useState(filterOptions[0]);
  const [displayAs, setDisplayAs] = useState<DisplayAs>('feed');
  const [modalItemIndex, setModalItemIndex] = useState<number | null>(null);
  const [mutedUsers] = useLocalState('muted', {});
  const [showUntil, setShowUntil] = useState(Math.floor(Date.now() / 1000));

  useEffect(() => {
    setShowUntil(Math.floor(Date.now() / 1000));
  }, [filterOption, displayAs]);

  const filterFn = useCallback(
    (event) => {
      if (mutedUsers[event.pubkey]) {
        return false;
      }
      if (filterOption.filterFn) {
        return filterOption.filterFn(event);
      }
      return true;
    },
    [mutedUsers, filterOption],
  );

  const { events, loadMore } = fetchEvents({
    filter: filterOption.filter,
    filterFn,
    sinceLastOpened: false,
  });

  if (events.length && events[0].pubkey === Key.getPubKey() && events[0].created_at > showUntil) {
    setShowUntil(Math.floor(Date.now() / 1000));
  }

  const hasNewEvents = events.length && events[0].created_at > showUntil;

  const isEmpty = events.length === 0;

  const imagesAndVideos: ImageOrVideo[] = useMemo(() => {
    if (displayAs === 'feed') {
      return [];
    }
    return mapEventsToMedia(events);
  }, [events, displayAs]);

  return (
    <>
      <Show when={hasNewEvents}>
        <ShowNewEvents
          onClick={() => {
            setShowUntil(Math.floor(Date.now() / 1000));
            if (feedTopRef.current) {
              feedTopRef.current.scrollIntoView({ behavior: 'smooth' });
            }
          }}
        />
      </Show>
      <div ref={feedTopRef} />
      <Show when={filterOptions.length > 1}>
        <FilterOptionsSelector
          filterOptions={filterOptions}
          activeOption={filterOption}
          onOptionClick={(opt) => {
            setFilterOption(opt);
          }}
        />
      </Show>
      <Show when={showDisplayAs !== false}>
        <DisplaySelector
          onDisplayChange={(displayAs) => {
            setDisplayAs(displayAs);
          }}
          activeDisplay={displayAs}
        />
      </Show>
      <ImageModal
        setModalItemIndex={setModalItemIndex}
        modalItemIndex={modalItemIndex}
        imagesAndVideos={imagesAndVideos}
      />
      <Show when={isEmpty}>{emptyMessage || 'No Posts'}</Show>
      <Show when={displayAs === 'grid'}>
        <div className="grid grid-cols-3 gap-px">
          <InfiniteScroll loadMore={loadMore}>
            {imagesAndVideos.map((item, index) => (
              <ImageGridItem
                key={`grid-${index}`}
                item={item}
                index={index}
                setModalItemIndex={setModalItemIndex}
              />
            ))}
          </InfiniteScroll>
        </div>
      </Show>
      <Show when={displayAs === 'feed'}>
        <InfiniteScroll loadMore={loadMore}>
          {events.map((event) => {
            if (event.created_at > showUntil) {
              return null;
            }
            return (
              <EventComponent key={`${event.id}EC`} id={event.id} {...filterOption.eventProps} />
            );
          })}
        </InfiniteScroll>
      </Show>
    </>
  );
};

export default memo(Feed);
