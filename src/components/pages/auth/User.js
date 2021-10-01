import axios from 'axios';

class User {
    isLoggedIn = () => this.get('isLoggedIn') === 'true';

    set = (key, value) => localStorage.setItem(key, value);

    get = key => this.getLocalStorage(key);

    getLocalStorage = key => {
        const ret = localStorage.getItem(key);
        if (ret) {
            return ret;
        }
        return null;
    };

    login = async (username, password) => {

        // ログイン処理
        // ログインエラー時には、falseを返してもいいし、returnを別の用途で利用したかったら
        // 例外を出しして呼び出し元でcatchしてもいいかと思います。

        axios.post('http://localhost:3001/login', {
            username: username.value,
            password: password.value,
        }).then(response => {
            console.log(response.data)
        }).catch(error => {
            console.log(error);
        });

        // this.set('isLoggedIn', true);
        // this.set('username', username);

        return true;
    };

    logout = async () => {
        if (this.isLoggedIn()) {
            this.set('isLoggedIn', false);
            this.set('id', null);
            this.set('icon', null);
            this.set('username', null);
            // ログアウト処理
            //　他に必要な処理があるのならこちら

        }
    };
}

export default new User();
