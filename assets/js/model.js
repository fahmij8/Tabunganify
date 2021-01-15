// Model Architecture
const model = tf.sequential();
model.add(
     tf.layers.simpleRNN({
          units: 128,
          recurrentInitializer: "glorotNormal",
          inputShape: [2, 1],
     })
);
model.add(
     tf.layers.dense({
          units: 8,
          activation: "relu",
     })
);
model.add(
     tf.layers.dense({
          units: 1,
     })
);
model.compile({
     loss: tf.losses.huberLoss,
     optimizer: "adam",
     metrics: ["mae"],
});

// Summary
console.log(model.summary());

// Input data
let x_train = tf.tensor3d([1.0, 0.974359, 0.974359, 0.974359, 0.974359, 0.948718, 0.948718, 0.948718, 0.948718, 0.923077, 0.923077, 0.871795, 0.871795, 0.820513, 0.820513, 0.74359], [8, 2, 1]);

let y_train = tf.tensor2d([0.974359, 0.948718, 0.948718, 0.923077, 0.871795, 0.820513, 0.74359, 0.692308], [8, 1]);

let x_test = tf.tensor3d([0.564103, 0.487179, 0.487179, 0.435897], [2, 2, 1]);

let y_test = tf.tensor2d([0.435897, 0.435897], [2, 1]);

history = model.fit(x_train, y_train, { epochs: 300, yieldEvery: "epoch", validationData: [x_test, y_test] }).then((info) => console.log(info));

let result = model.predict(tf.tensor3d([1.0, 0.974359], [1, 2, 1])).print();

result.dataSync()[0];
