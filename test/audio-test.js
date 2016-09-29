import test from 'ava';
import { say, audio,  DirectiveType} from '../src';
import { ssml } from 'alexa-ssml';

test('Play', t => {
  const expectedResponse = {
    version: '1.0',
    response: {
      shouldEndSession: true,
      directives: [
        {
          type: 'AudioPlayer.Play',
          playBehavior: 'ENQUEUE',
          audioItem: {
            stream: {
              url: 'https://my-audio-hosting-site.com/audio/sample-song.mp3',
              token: 'something',
              offsetInMilliseconds: 42,
            }
          }
        }
      ]
    }
  };

  const actualResponse = audio({
    type: DirectiveType.Play,
    url: 'https://my-audio-hosting-site.com/audio/sample-song.mp3',
    token: 'something',
    offsetInMilliseconds: 42
  }).build();

  t.deepEqual(actualResponse, expectedResponse);
});

test('Say and Play', t => {
  const expectedResponse = {
    version: '1.0',
    response: {
      shouldEndSession: true,
      outputSpeech: { type: 'PlainText', text: 'Hello world' },
      directives: [
        {
          type: 'AudioPlayer.Play',
          playBehavior: 'ENQUEUE',
          audioItem: {
            stream: {
              url: 'https://my-audio-hosting-site.com/audio/sample-song.mp3',
              token: 'something',
              offsetInMilliseconds: 42,
            }
          }
        }
      ]
    }
  };

  const actualResponse = say('Hello world').audio({
    type: DirectiveType.Play,
    url: 'https://my-audio-hosting-site.com/audio/sample-song.mp3',
    token: 'something',
    offsetInMilliseconds: 42
  }).build();

  t.deepEqual(actualResponse, expectedResponse);
});

test('Stop', t => {
  const expectedResponse = {
    version: '1.0',
    response: {
      shouldEndSession: true,
      directives: [
        {
          type: 'AudioPlayer.Stop',
        }
      ]
    }
  };

  const actualResponse = audio({ type: DirectiveType.Stop }).build();

  t.deepEqual(actualResponse, expectedResponse);
});

test('ClearQueue', t => {
  const expectedResponse = {
    version: '1.0',
    response: {
      shouldEndSession: true,
      directives: [
        {
          type: 'AudioPlayer.ClearQueue',
          clearBehavior: 'CLEAR_ALL',
        }
      ]
    }
  };

  const actualResponse = audio({ type: DirectiveType.ClearQueue }).build();

  t.deepEqual(actualResponse, expectedResponse);
});


