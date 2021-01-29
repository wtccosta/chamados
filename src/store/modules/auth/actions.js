
export default {
  login(context, {login, token}) {
    localStorage.setItem("session_token", `Bearer ${token}`);
    context.commit("SET_USER", login);
  },

  logoff({commit} ) {
    commit("UNSET_USER");
    localStorage.clear();
  },
};
