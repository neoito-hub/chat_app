import model from "./models/index.mjs";
model.sequelize
  .authenticate()
  .then(() => {
    console.log("Success!");
    model.sequelize
      .sync({ alter: true })
      .then(() => {
        console.log("Synced with the database");
      })
      .catch((err) => {
        console.log("error is", err);
        throw err;
      });
  })
  .catch((err) => {
    console.log("Error while syncing with the database", err);
  });
