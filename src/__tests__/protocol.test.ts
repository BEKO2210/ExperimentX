import { describe, expect, it } from 'vitest';
import { PROTOCOL_NOTES, PROTOCOL_VERSION } from '../domain/protocol';

describe('protocol', () => {
  it('exposes protocol version and notes', () => {
    expect(PROTOCOL_VERSION).toMatch(/0\.1/);
    expect(PROTOCOL_NOTES.length).toBeGreaterThan(1);
  });
});
