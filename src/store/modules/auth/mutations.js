export default{
    SET_USER(state, user){
        console.log("From mutations");
        state.user = user;
        state.logged = true;
    },

    UNSET_USER(state){
        state.user = null;
        state.logged = false;
       localStorage.removeItem('session_token');

}};