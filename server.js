const _0x4fd8 = [
  "port",
  "token\x20field\x20missing",
  "/signup",
  "password\x20field\x20missing",
  "set",
  "ExampleName",
  "tok",
  "password",
  "parse",
  "Username\x20exists",
  "token",
  "Invalid\x20token",
  "username",
  "/messages",
  "stringify",
  "contents",
  "body",
  "has",
  "use",
  "post",
  "log",
  "send",
  "User\x20does\x20not\x20exist",
  "get",
  "username\x20field\x20missing",
  "raw",
  "/login",
  "express",
  "Example\x20message",
  "env"
];

(function(_0x43ecc8, _0x4fd839) {
  const _0x323c3b = function(_0x568a2a) {
    while (--_0x568a2a) {
      _0x43ecc8["push"](_0x43ecc8["shift"]());
    }
  };
  _0x323c3b(++_0x4fd839);
})(_0x4fd8, 0xc3);
const _0x323c = function(_0x43ecc8, _0x4fd839) {
  _0x43ecc8 = _0x43ecc8 - 0x0;
  let _0x323c3b = _0x4fd8[_0x43ecc8];
  return _0x323c3b;
};
const _0x5a920a = _0x323c;
let cors = require("cors"),
  express = require(_0x5a920a("0xc")),
  app = express(),
  bodyParser = require("body-parser");
  app[_0x5a920a("0x3")](bodyParser[_0x5a920a("0xa")]({ type: "*/*" })),
  app["use"](cors());
app.use(express.static('public'));

let passwords = new Map(),
  sessions = new Map(),
  messages = [{ from: _0x5a920a("0x14"), contents: _0x5a920a("0xd") }],
  counter = 0x0,
  genToken = () => {
    const _0x3c8a43 = _0x5a920a;
    return counter++, _0x3c8a43("0x15") + counter;
  };

app.get("/", (req, res) => {
  res.sendFile(__dirname + "/views/index.html");
});

app["post"](_0x5a920a("0x11"), (_0x568a2a, _0x2c2841) => {
  debugger
  console.log("signup")
  const _0x3d6318 = _0x5a920a;
  let _0x4b7e54 = JSON[_0x3d6318("0x17")](_0x568a2a[_0x3d6318("0x1")]),
    _0x20aa92 = _0x4b7e54[_0x3d6318("0x1b")],
    _0xcf2699 = _0x4b7e54[_0x3d6318("0x16")];
  if (_0x20aa92 === undefined) {
    _0x2c2841[_0x3d6318("0x6")](
      JSON["stringify"]({ success: ![], reason: _0x3d6318("0x9") })
    );
    return;
  }
  if (_0xcf2699 === undefined) {
    _0x2c2841[_0x3d6318("0x6")](
      JSON[_0x3d6318("0x1d")]({ success: ![], reason: _0x3d6318("0x12") })
    );
    return;
  }
  if (passwords["has"](_0x20aa92)) {
    _0x2c2841["send"](
      JSON[_0x3d6318("0x1d")]({ success: ![], reason: _0x3d6318("0x18") })
    );
    return;
  }
  passwords[_0x3d6318("0x13")](_0x20aa92, _0xcf2699),
    _0x2c2841[_0x3d6318("0x6")](JSON[_0x3d6318("0x1d")]({ success: !![] }));
}),
  app[_0x5a920a("0x4")](_0x5a920a("0xb"), (_0x3896e3, _0x3eafa8) => {
    debugger
    console.log("WTF1")
    const _0x390273 = _0x5a920a;
    let _0x4d8590 = JSON[_0x390273("0x17")](_0x3896e3["body"]),
      _0x2e321f = _0x4d8590[_0x390273("0x1b")],
      _0x509f7c = _0x4d8590[_0x390273("0x16")];
    if (!_0x2e321f) {
      _0x3eafa8[_0x390273("0x6")](
        JSON[_0x390273("0x1d")]({ success: ![], reason: _0x390273("0x9") })
      );
      return;
    }
    if (!_0x509f7c) {
      _0x3eafa8[_0x390273("0x6")](
        JSON[_0x390273("0x1d")]({ success: ![], reason: _0x390273("0x12") })
      );
      return;
    }
    if (!passwords[_0x390273("0x2")](_0x2e321f)) {
      _0x3eafa8[_0x390273("0x6")](
        JSON[_0x390273("0x1d")]({ success: ![], reason: _0x390273("0x7") })
      );
      return;
    }
    let _0x556c7e = passwords[_0x390273("0x8")](_0x2e321f);
    if (_0x556c7e !== _0x509f7c) {
      _0x3eafa8["send"](
        JSON[_0x390273("0x1d")]({ success: ![], reason: "Invalid\x20password" })
      );
      return;
    }
    let _0x7d8b9b = genToken();
    sessions[_0x390273("0x13")](_0x7d8b9b, _0x2e321f),
      _0x3eafa8["send"](
        JSON[_0x390273("0x1d")]({ success: !![], token: _0x7d8b9b })
      );
  }),
  app[_0x5a920a("0x4")]("/message", (_0x3ac1a1, _0x5a6cae) => {
     debugger
    console.log("WTF2")
    const _0x557b6f = _0x5a920a;
    let _0x520aab = JSON["parse"](_0x3ac1a1[_0x557b6f("0x1")]),
      _0x45d518 = _0x520aab[_0x557b6f("0x0")],
      _0x136604 = _0x520aab[_0x557b6f("0x19")];
    if (!_0x136604) {
      _0x5a6cae[_0x557b6f("0x6")](
        JSON[_0x557b6f("0x1d")]({ success: ![], reason: _0x557b6f("0x10") })
      );
      return;
    }
    if (!sessions["has"](_0x136604)) {
      _0x5a6cae["send"](
        JSON[_0x557b6f("0x1d")]({ success: ![], reason: _0x557b6f("0x1a") })
      );
      return;
    }
    let _0x2125f7 = sessions[_0x557b6f("0x8")](_0x136604);
    if (!_0x45d518) {
      _0x5a6cae[_0x557b6f("0x6")](
        JSON[_0x557b6f("0x1d")]({
          success: ![],
          reason: "contents\x20field\x20missing"
        })
      );
      return;
    }
    messages["push"]({ from: _0x2125f7, contents: _0x45d518 }),
      _0x5a6cae["send"](JSON[_0x557b6f("0x1d")]({ success: !![] }));
  }),
  app[_0x5a920a("0x8")](_0x5a920a("0x1c"), (_0x5c321d, _0x5c146b) => {
  debugger
    console.log("WTF3")
    const _0x10e03b = _0x5a920a;
    _0x5c146b[_0x10e03b("0x6")](
      JSON[_0x10e03b("0x1d")]({ success: !![], messages: messages })
    );
  }),
  
  app.post("/resetMap", (req, res) => {
  passwords.clear();
  res.send("good, the size after clearing is: "+passwords.size);
});
const listener = app["listen"](
  process[_0x5a920a("0xe")]["PORT"] || 0xfa0,
  () => {
    const _0x30d773 = _0x5a920a;
    console[_0x30d773("0x5")](
      "Your\x20app\x20is\x20listening\x20on\x20port\x20" +
        listener["address"]()[_0x30d773("0xf")]
    );
  }
);
