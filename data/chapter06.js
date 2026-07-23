window.EIKEN3_DATA = window.EIKEN3_DATA || [];

const chapter06CardA = {
  title: "カードA Movies",
  passage: "Movies\nThere are a lot of movie theaters in the city. They are often crowded with people on weekends. Some people like to see movies on large screens, so they go to movie theaters.",
  translation: "映画\n都市にはたくさんの映画館があります。週末になるとそれらはしばしば人で混雑します。一部の人たちは大きな画面で映画を見るのが好きなので、しばしば映画館に行きます。",
  image: "chapter06/card_a.png",
  questions: [
    {
      no: 1,
      question: "Please look at the passage. Why do some people go to movie theaters?",
      jp: "文章を見てください。なぜ一部の人々は映画館に行くのでしょうか。",
      answer: "Because they like to see movies on large screens.",
      answerJp: "彼らは大きなスクリーンで映画を観るのが好きだからです。"
    },
    {
      no: 2,
      question: "Please look at the picture. Where is the telephone?",
      jp: "絵を見てください。電話はどこにありますか。",
      answer: "It's by the door.",
      answerJp: "ドアのそばにあります。"
    },
    {
      no: 3,
      question: "Please look at the boy. What is the boy going to do?",
      jp: "男の子を見てください。その男の子は何をしようとしていますか。",
      answer: "He's going to buy a soft drink.",
      answerJp: "彼は飲み物を買おうとしています。"
    },
    {
      no: 4,
      question: "What is your favorite food?",
      jp: "あなたの大好きな食べ物は何ですか。",
      answer: "My favorite food is pizza.",
      answerJp: "私の大好きな食べ物はピザです。"
    },
    {
      no: 5,
      question: "Do you like to go to sporting events?",
      jp: "あなたはスポーツイベントに行くのが好きですか。",
      answer: "Yes. I often go to baseball games. / No. I'm not very interested in sports.",
      answerJp: "はい。私はしばしば野球の試合を見に行きます。/ いいえ。私はスポーツにあまり興味がありません。"
    }
  ]
};

function chapter06QuestionList() {
  return chapter06CardA.questions
    .map((item) => `No.${item.no} ${item.question}\n答え例: ${item.answer}\n日本語: ${item.answerJp}`)
    .join("\n\n");
}

const chapter06Questions = [
  {
    chapter: 6,
    id: 1,
    type: "study",
    typeLabel: "イラスト1",
    title: "入室",
    prompt: "面接室に入ったら、元気よくあいさつします。",
    script: "受験者: Good morning.\n面接委員: Good morning.\n受験者: Here it is.\n面接委員: Thank you. Have a seat.\n受験者: Thank you.",
    translation: "受験者: おはようございます。\n面接委員: おはようございます。\n受験者: はい、どうぞ。\n面接委員: ありがとう。座ってください。\n受験者: ありがとうございます。",
    audio: "E42.mp3",
    image: "chapter06/interview_01.png",
    answer: "Good morning. / Here it is. / Thank you.",
    modelAnswer: "Good morning.\nHere it is.\nThank you.",
    explanation: "入室後は、あいさつ、面接カードの手渡し、着席の指示への返事を落ち着いて行います。"
  },
  {
    chapter: 6,
    id: 2,
    type: "study",
    typeLabel: "イラスト2",
    title: "最初の質問",
    prompt: "名前と受験級を確認されます。",
    script: "面接委員: My name is Jennifer Borio. What's your name?\n受験者: My name is Yukiko Kaneko.\n面接委員: You're taking the 3rd Grade test. Is that right?\n受験者: Yes, that's right.",
    translation: "面接委員: 私の名前はジェニファー・ボリオです。あなたの名前は何ですか。\n受験者: 私の名前は金子由紀子です。\n面接委員: あなたは3級の試験を受けるのですね。そうですか。\n受験者: はい、そうです。",
    audio: "E42.mp3",
    image: "chapter06/interview_02.png",
    answer: "My name is Yukiko Kaneko. / Yes, that's right.",
    modelAnswer: "My name is Yukiko Kaneko.\nYes, that's right.",
    explanation: "最初の質問は名前と受験級です。はっきり短く答えれば大丈夫です。"
  },
  {
    chapter: 6,
    id: 3,
    type: "study",
    typeLabel: "イラスト3",
    title: "カードの受け取り",
    prompt: "問題カードを受け取り、20秒間黙読します。",
    script: "面接委員: OK. Now, let's begin the test. Here's the card for you.\n受験者: Thank you.\n面接委員: Please read it silently for twenty seconds.\n受験者: Sure.\n面接委員: Here you go.",
    translation: "面接委員: では、試験を始めましょう。これがあなたのカードです。\n受験者: ありがとうございます。\n面接委員: 20秒間、黙読してください。\n受験者: はい。\n面接委員: どうぞ。",
    audio: "E42.mp3",
    image: "chapter06/interview_03.png",
    answer: "Thank you. / Sure.",
    modelAnswer: "Thank you.\nSure.",
    explanation: "カードには短い英文とイラストがあります。内容を理解できるように、落ち着いて読みます。"
  },
  {
    chapter: 6,
    id: 4,
    type: "study",
    typeLabel: "イラスト4・カードA",
    title: "音読",
    prompt: "カードAの英文を、ゆっくり大きな声で読みます。",
    passage: chapter06CardA.passage,
    script: "面接委員: Now, Miss Kaneko, please read it aloud.\n受験者: OK.\n受験者: Movies. There are a lot of movie theaters in the city. They are often crowded with people on weekends. Some people like to see movies on large screens, so they go to movie theaters.",
    translation: chapter06CardA.translation,
    audio: "E43.mp3",
    image: "chapter06/interview_04.png",
    answer: chapter06CardA.passage,
    modelAnswer: chapter06CardA.passage,
    explanation: "音読は速すぎず、区切りを意識して読みます。カードAの英文と日本語訳も確認しましょう。"
  },
  {
    chapter: 6,
    id: 5,
    type: "study",
    typeLabel: "イラスト5・カードA",
    title: "質問1",
    prompt: "カードAの文章を見て、No.1 の質問に答えます。",
    passage: `${chapter06CardA.passage}\n\n${chapter06QuestionList()}`,
    script: "面接委員: Thank you, Miss Kaneko. Now, I'm going to ask you five questions. Are you ready?\n受験者: Yes, I am.\n面接委員: Number 1. Please look at the passage. Why do some people go to movie theaters?\n受験者: Pardon?\n面接委員: Please look at the passage. Why do some people go to movie theaters?\n受験者: Because they like to see movies on large screens.",
    translation: "面接委員: ありがとう、金子さん。これから5つ質問します。準備はいいですか。\n受験者: はい。\n面接委員: 1番。文章を見てください。なぜ一部の人々は映画館に行くのでしょうか。\n受験者: もう一度お願いします。\n面接委員: 文章を見てください。なぜ一部の人々は映画館に行くのでしょうか。\n受験者: 彼らは大きなスクリーンで映画を観るのが好きだからです。",
    audio: ["E43.mp3", "E44.mp3"],
    image: "chapter06/interview_05.png",
    answer: "Because they like to see movies on large screens.",
    modelAnswer: chapter06QuestionList(),
    explanation: "質問が聞き取れなかったら Pardon? と言って、もう一度言ってもらえます。No.1 は本文の so they go to movie theaters の前の理由を使います。"
  },
  {
    chapter: 6,
    id: 6,
    type: "study",
    typeLabel: "イラスト6・カードA",
    title: "質問2〜4",
    prompt: "イラスト質問と個人質問に答えます。",
    passage: `${chapter06CardA.passage}\n\n${chapter06QuestionList()}`,
    script: "面接委員: Number 2. Please look at the picture. Where is the telephone?\n受験者: It's by the door.\n面接委員: Now, Miss Kaneko, please turn the card over.\n面接委員: Number 4. What is your favorite food?\n受験者: My favorite food is pizza.",
    translation: "面接委員: 2番。絵を見てください。電話はどこにありますか。\n受験者: ドアのそばにあります。\n面接委員: では、金子さん、カードを裏返してください。\n面接委員: 4番。あなたの大好きな食べ物は何ですか。\n受験者: 私の大好きな食べ物はピザです。",
    audio: ["E44.mp3", "E45.mp3"],
    image: "chapter06/interview_06.png",
    answer: "It's by the door. / My favorite food is pizza.",
    modelAnswer: chapter06QuestionList(),
    explanation: "No.2 はイラストを見て場所を答えます。カードを裏返した後の No.4 と No.5 は、自分自身について答える質問です。"
  },
  {
    chapter: 6,
    id: 7,
    type: "study",
    typeLabel: "イラスト7・カードA",
    title: "退室",
    prompt: "面接が終わったら、感謝を伝えて退室します。",
    passage: chapter06CardA.passage,
    script: "面接委員: That's all, Miss Kaneko.\n受験者: Thank you. Have a good day.\n面接委員: Thank you. You, too.",
    translation: "面接委員: これで終わりです、金子さん。\n受験者: ありがとうございました。よい一日を。\n面接委員: ありがとう。あなたも。",
    audio: "E45.mp3",
    image: "chapter06/interview_07.png",
    answer: "Thank you. Have a good day.",
    modelAnswer: "Thank you. Have a good day.",
    explanation: "最後も Thank you. を忘れずに言います。落ち着いてカードを返して退室します。"
  }
];

window.EIKEN3_DATA.push({
  id: 6,
  title: "二次試験・面接対策",
  subtitle: "入室・カードA・音読・質問応答・退室",
  description: "英検3級の二次試験対策です。カードA Movies を使って、面接の流れと音源42〜45を確認します。",
  questions: chapter06Questions
});
