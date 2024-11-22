class SystemState {
    constructor() {
        this.stateManager = new StateManager();
        this.snapshotManager = new SnapshotManager();
        this.replicator = new StateReplicator();
    }

    async updateState(changes) {
        const snapshot = await this.snapshotManager.createSnapshot();
        const updatedState = await this.stateManager.applyChanges(changes);

        await Promise.all([
            this.replicator.replicateState(updatedState),
            this.snapshotManager.saveSnapshot(snapshot)
        ]);

        return updatedState;
    }
}
