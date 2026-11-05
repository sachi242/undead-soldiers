/* Small PeerJS transport. One host, one guest, no game state in signaling. */
(function (scope) {
  'use strict';
  class PinRoom {
    constructor(PeerClass, notify, receive) {
      this.PeerClass = PeerClass; this.notify = notify; this.receive = receive;
      this.peer = null; this.connection = null; this.timer = null; this.generation = 0;
      this.role = null; this.pin = null;
    }
    static validPin(pin) { return typeof pin === 'string' && /^\d{4}$/.test(pin); }
    static id(pin) { return 'undead-soldiers-v1-' + pin; }
    send(data) {
      if (!this.connection?.open || this.connection.bufferSize > 20) return false;
      try { this.connection.send(data); return true; } catch { return false; }
    }
    leave(message = 'Solo mode') {
      this.generation++; clearTimeout(this.timer);
      const peer = this.peer; this.peer = null; this.connection = null;
      this.role = null; this.pin = null;
      if (peer) peer.destroy();
      this.notify('idle', message);
    }
    start(role, pin, attempt = 0) {
      if (!this.PeerClass) { this.notify('error', 'Networking library unavailable. Refresh or play solo.'); return; }
      if (role === 'guest' && !PinRoom.validPin(pin)) { this.notify('error', 'Enter exactly four digits.'); return; }
      this.leave(); this.role = role;
      if (role === 'host') {
        const value = new Uint32Array(1); scope.crypto.getRandomValues(value);
        pin = String(value[0] % 10000).padStart(4, '0');
      }
      this.pin = pin; const generation = this.generation;
      const live = () => generation === this.generation;
      this.notify('connecting', role === 'host' ? 'Creating room…' : 'Joining ' + pin + '…');
      const fail = message => { if (live()) { this.leave(message); this.notify('error', message); } };
      let peer;
      try { peer = new this.PeerClass(role === 'host' ? PinRoom.id(pin) : undefined, {debug: 0}); }
      catch { fail('Could not start WebRTC. Try a current browser.'); return; }
      this.peer = peer;
      this.timer = setTimeout(() => fail('Connection timed out. Check the PIN, host tab, and network. Some networks require a TURN relay.'), 20000);
      const bind = connection => {
        if (!live()) { connection.close(); return; }
        if (this.connection) { connection.on('open', () => { connection.send({type:'full'}); connection.close(); }); return; }
        this.connection = connection;
        connection.on('open', () => {
          if (!live()) return;
          clearTimeout(this.timer); this.notify('connected', 'PIN ' + pin + ' · 2 / 2 players');
        });
        connection.on('data', data => {
          if (!live()) return;
          if (data?.type === 'full') { fail('Room full. Only two players can join this duel.'); return; }
          this.receive(data);
        });
        connection.on('close', () => fail('Other player left. Host or join a new room.'));
        connection.on('error', () => fail('Peer connection failed. Try another network or a new room.'));
      };
      peer.on('open', () => {
        if (!live()) return;
        if (role === 'host') { clearTimeout(this.timer); this.notify('waiting', 'Room PIN: ' + pin + ' · waiting for friend'); }
        else bind(peer.connect(PinRoom.id(pin), {reliable:true, serialization:'json'}));
      });
      peer.on('connection', connection => { if (role === 'host') bind(connection); else connection.close(); });
      peer.on('error', error => {
        if (!live()) return;
        if (role === 'host' && error.type === 'unavailable-id' && attempt < 5) { this.start(role, null, attempt + 1); return; }
        fail(error.type === 'peer-unavailable' ? 'Room not found. Check the PIN and keep the host tab open.' : 'Signaling failed (' + (error.type || 'network') + '). Try again.');
      });
      peer.on('disconnected', () => { if (live() && !this.connection?.open) fail('Room service disconnected. Create or join a new room.'); });
    }
  }
  scope.PinRoom = PinRoom;
  if (typeof module !== 'undefined') module.exports = PinRoom;
})(typeof window !== 'undefined' ? window : globalThis);
