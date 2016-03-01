import { renderToString } from 'alexa-ssml';

export const SSML = 'SSML';
export const PlainText = 'PlainText';
export const Simple = 'Simple';

export default class Response {
  static ask = (...args) => new Response().ask(...args);
  static say = (...args) => new Response().say(...args);
  static card = (...args) => new Response().card(...args);
  static reprompt = (...args) => new Response().reprompt(...args);
  static shouldEndSession = (...args) => new Response().shouldEndSession(...args);

  constructor(state = {}) {
    this.state = state;
  }

  ask(type, text) {
    return this.say(type, text).shouldEndSession(false);
  }

  say(type, text) {
    return new Response({
      ...this.state,
      response: {
        ...this.state.response,
        shouldEndSession: true,
        ...outputSpeech(type, text)
      }
    });
  }

  reprompt(type, text) {
    return new Response({
      ...this.state,
      response: {
        ...this.state.response,
        reprompt: { ...outputSpeech(type, text) }
      }
    });
  }

  card(title, content, type = Simple) {
    return new Response({
      ...this.state,
      response: {
        ...this.state.response,
        card: { type, title, content }
      }
    });
  }

  attributes(data) {
    return new Response({
      ...this.state,
      sessionAttributes: {
        ...this.state.sessionAttributes,
        ...data
      }
    });
  }

  shouldEndSession(shouldEndSession) {
    return new Response({
      ...this.state,
      response: {
        ...this.state.response,
        shouldEndSession
      }
    });
  }

  build(attributes) {
    return {
      version: '1.0',
      ...this.state,
      response: {
        shouldEndSession: true,
        ...this.state.response
      },
      ...(attributes || this.state.sessionAttributes ? { sessionAttributes: { ...attributes, ...this.state.sessionAttributes } } : null)
    };
  }
}

const outputSpeech = (_type, _text) => {
  const type = _text === undefined ? PlainText : _type;
  const text = _text === undefined ? _type : _text;

  if (type === SSML || typeof text === 'object') {
    return { outputSpeech: { type: SSML, ssml: (typeof text === 'object') ? renderToString(text) : text } };
  } else {
    return { outputSpeech: { type, text } };
  }
};

// For commonjs compatibility
export const ask = Response.ask;
export const say = Response.say;
export const card = Response.card;
export const reprompt = Response.reprompt;
export const shouldEndSession = Response.shouldEndSession;
