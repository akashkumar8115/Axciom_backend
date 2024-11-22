const tf = require('@tensorflow/tfjs-node');

class MachineLearningService {
    constructor() {
        this.model = null;
        this.initializeModel();
    }

    async initializeModel() {
        this.model = tf.sequential({
            layers: [
                tf.layers.dense({ units: 64, activation: 'relu', inputShape: [10] }),
                tf.layers.dense({ units: 32, activation: 'relu' }),
                tf.layers.dense({ units: 16, activation: 'softmax' })
            ]
        });

        this.model.compile({
            optimizer: tf.train.adam(),
            loss: 'categoricalCrossentropy',
            metrics: ['accuracy']
        });
    }

    async predictUserInterests(userData) {
        const tensorData = tf.tensor2d([this.preprocessUserData(userData)]);
        const prediction = await this.model.predict(tensorData).array();
        return this.interpretPrediction(prediction[0]);
    }
}
