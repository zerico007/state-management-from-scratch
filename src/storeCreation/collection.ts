type CollectibleObject<Collectible> = {
  id: string;
  collectible: Collectible;
};

class Collection<Collectible> {
  collectibles: CollectibleObject<Collectible>[];

  constructor() {
    this.collectibles = [];
  }

  add(collectible: Collectible) {
    const newId = new String(collectible).valueOf();
    const isAlreadyAdded = this.collectibles.some(
      (collectibleObject) => collectibleObject.id === newId
    );
    if (isAlreadyAdded) {
      return;
    }
    this.collectibles.push({ id: newId, collectible });
  }

  remove(collectible: Collectible) {
    const newId = new String(collectible).valueOf();
    this.collectibles = this.collectibles.filter(
      (collectibleObject) => collectibleObject.id !== newId
    );
  }

  each(callback: (collectible: Collectible) => void) {
    for (const collectibleObject of this.collectibles) {
      callback(collectibleObject.collectible);
    }
  }
}

export default Collection;
