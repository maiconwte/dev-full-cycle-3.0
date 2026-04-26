import { VideoAudioMediaUploadedIntegrationEvent } from '../../../video/domain/domain-events/video-audio-media-replaced.event';

// eslint-disable-next-line @typescript-eslint/no-unused-expressions
VideoAudioMediaUploadedIntegrationEvent;

export const EVENTS_MESSAGE_BROKER_CONFIG = {
  [VideoAudioMediaUploadedIntegrationEvent.name]: {
    exchange: 'amq.direct',
    routing_key: VideoAudioMediaUploadedIntegrationEvent.name,
  },
  TestEvent: {
    exchange: 'test-exchange',
    routing_key: 'TestEvent',
  },
};
