export class VirtualCell {
  constructor(x, y) {
    this.x = x;
    this.y = y;
  }

  linkTile(tile) {
    tile.setX(this.x);
    tile.setY(this.y);
    this.linkedTile = tile;
  }

  unlinkTile() {
    this.linkedTile = null;
  }

  hasLinkedTile() {
    return !!this.linkedTile;
  }

  linkTileForMerge(tile) {
    tile.setX(this.x);
    tile.setY(this.y);
    this.linkedTileForMerge = tile;
  }

  unlinkTileForMerge() {
    this.linkedTileForMerge = null;
  }

  hasLinkedTileForMerge() {
    return !!this.linkedTileForMerge;
  }

  canAccept(tile) {
    return (
      !this.hasLinkedTile() ||
      (!this.hasLinkedTileForMerge() && this.linkedTile.value === tile.value)
    );
  }

  mergeTiles() {
    if (!this.hasLinkedTile() || !this.hasLinkedTileForMerge()) {
      return;
    }

    this.linkedTile.setValue(this.linkedTile.value + this.linkedTileForMerge.value);
    this.linkedTileForMerge.removeFromDOM();
    this.unlinkTileForMerge();
  }
}