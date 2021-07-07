//
// ログイン用JS
//

// クラスの取得及び変数の定義
const loginForm = document.querySelector('.login');

/* ------------------------------
    Loading イメージ表示関数
    引数： msg 画面に表示する文言
------------------------------ */
function dispLoading(msg){
    // 引数なし（メッセージなし）を許容
    if( msg == undefined ){
        msg = "";
    }
    // 画面表示メッセージ
    var dispMsg = "<div class='loadingMsg'>" + msg + "</div>";
    // ローディング画像が表示されていない場合のみ出力
    if($("#loading").length == 0){
        $("body").append("<div id='loading'>" + dispMsg + "</div>");
    }
}


/* ------------------------------
Loading イメージ削除関数
------------------------------ */
function removeLoading(){
    $("#loading").remove();
}


/* ------------------------------
    ログインボタン押下時の処理
    引数： 
------------------------------ */
loginForm.addEventListener('submit', (e) => {
    e.preventDefault();
    
    // フォームの値の取得
    const number = loginForm.number.value;
    const pass = loginForm.pass.value;

    dispLoading("ログイン中...");

    // 社員番号からメールアドレスを返すAPIを叩く
    async function apieExecion(number) {
        // getEmailの呼び出し
        const getEmail = await firebase.functions().httpsCallable('getEmail');
        getEmail({
            number: number// APIに社員番号を送る
        })
        .then((getEmail) => {// 成功時
            const email = getEmail.data.userEmail.email;
            if(email != undefined){
                console.log(email);// 成功時にメールアドレスを受け取る
                login(email, pass);// ログインのauth関数の呼び出し
            }else{
                console.log('メールアドレスがありません');
                loginForm.querySelector('.error').textContent = '社員番号または、パスワードが間違っています。｀';
            }
        })
        .catch(error => {// 例外エラー発生時
            loginForm.querySelector('.error').textContent = error.message;
            removeLoading();
        });
    }
    apieExecion(number);
});


/* ------------------------------
    firebase authログイン用関数
    引数： email メールアドレス
    引数： pass パスワード
------------------------------ */
function login(email, pass) {
    firebase.auth().signInWithEmailAndPassword(email, pass)
    .then(user => {// 成功時
        console.log('logged in', user);
        loginForm.reset();
        removeLoading();
    })
    .catch(error => {// 例外エラー発生時
        loginForm.querySelector('.error').textContent = error.message;
        removeLoading();
    });
}


/* ------------------------------
    firebase auth認証状態チェック
    引数： user auth認証情報
------------------------------ */
firebase.auth().onAuthStateChanged(user => {
    if (user) {
        window.location.href = 'info_emp.html';
    }  
});





