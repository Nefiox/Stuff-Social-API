const auth = require("../../../auth");
const bcrypt = require("bcrypt");
const TABLA = "auth";

module.exports = function (injectedStore) {
  let store = injectedStore;
  if (!store) {
    store = require("../../../store/dummy");
  }

  async function upsert(data) {
    const authData = {
      id: data.id,
    };

    if (data.username) {
      authData.username = data.username;
    }

    if (data.password) {
      authData.password = await bcrypt.hash(data.password, 10);
    }

    return store.upsert(TABLA, authData);
  }

  async function login(username, password) {
    const data = await store.query(TABLA, { username: username });
    console.log(data.username);

    return bcrypt.compare(password, data.password).then((sonIguales) => {
      if (sonIguales === true) {
        // Generar token;
        return auth.sign({...data});
      } else {
        throw new Error("Información inválida");
      }
    });
  }

  return {
    upsert,
    login,
  };
};
