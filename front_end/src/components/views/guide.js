import { Divider} from "antd";

function Guide(){
    return (
        <div style={{ width: "70%", margin: "0 auto", marginTop: "40px"}}>
        <h1 style={{ textAlign: "center", fontSize:"50px"}}> 👋 🆆🅴🅻🅲🅾🅼🅴 🅱🆁🅾🅾❗ ✨</h1>
        <h3 style={{ textAlign:"center"}}>
            🙆‍♀️ Thanks for use own service. 🙆‍♀️
        </h3>
        <Divider orientation="left">NOTIFY</Divider>
        <h3><strong>➡️This web application can send files to your Kindle.</strong></h3>
        <h3><strong>📛The maximum file size is 25 MB.</strong></h3>
        <h3><em>✔️ This web application support extensions .pdb, .mobi, .asw3 .epub  .chm .djvu .txt .html .docx .cbr .fb2 .rtf .odt</em></h3>
        <Divider orientation="left">SETUP</Divider>
        <h1>➡️ 🆂🅴🆃🆄🅿</h1>
        <ul>
            <li>✔️ Go to your <a href="https://www.amazon.com/mn/dcw/myx.html/ref=kinw_myk_surl_1#/home/settings/payment&context=Amazon">Amazon account</a> <strong>→ Preferences tab → Personal Document Settings</strong> and add <strong>send2kindle.ncsc@gmail.com</strong> to approved e-mail list (no mistake, you need to approve the whole domain)</li>
        </ul>
        <h3><strong>👆 This is necessary step to allow your Kindle account to receive files!</strong></h3>
        <h3><strong> 👏 This is all set up! 🎉</strong></h3>

        <h3 style={{ color: "red", marginBottom: "85px"}}>👉 <strong>After setup successfully, you can search or upload file to send it to your kindle 👀 </strong></h3>
        </div>

    )
}

export default Guide