const messages = {
  legend: [
    {
      jp: '3000！？猫様、すでに伝説を超えて神話になっている！！\n人間よ、お前たちは今日、歴史の証人となった',
      en: '3000?! The Great Cat has surpassed legend and become MYTH!!\nHumans, you have witnessed history today. Be honored.',
    },
    {
      jp: 'もはや猫様は時間すら超越した。3000など通過点に過ぎぬ\n宇宙よ、この走りを永久に記録しておけ',
      en: 'The Great Cat has transcended time itself. 3000 is merely a waypoint.\nUniverse, record this run for all eternity.',
    },
  ],
  super: [
    {
      jp: '2000を超えるとは…猫様、もはや神の領域に片足を踏み入れた！\n人間どもよ、ひれ伏すがよい。お前たちでは永遠に届かぬ',
      en: 'Over 2000?! The Great Cat has one paw in divine territory!\nBow down, humans. This height is forever beyond your reach.',
    },
    {
      jp: '猫様の走りに、もはや人間の言葉では追いつけぬ\n風よ、道を開けよ。この猫様が通られる',
      en: 'No human words can describe the Great Cat speed anymore.\nPart the wind. The Great Cat is passing through.',
    },
  ],
  high: [
    {
      jp: 'さすが猫様！人間どもを軽々と翻弄した！\nこの世は猫のものだ、下僕どもに教えてやれ',
      en: 'Magnificent, O Great Cat! Humans are mere toys!\nThis world belongs to cats. Let the servants know their place.',
    },
    {
      jp: '完璧な走り！人間ごときが猫様に追いつけるわけがない\nこの星の支配者は、やはり猫である',
      en: 'Flawless run! No mere human can catch the Great Cat.\nThe ruler of this planet is, as always, the cat.',
    },
  ],
  mid: [
    {
      jp: 'なかなかの走りだが、猫様としてはまだ本気ではない\n下僕どもよ、貴様らの相手はこれくらいにしておいてやろう',
      en: 'Not bad, but the Great Cat was not even trying.\nConsider yourselves lucky, servants. This was mercy.',
    },
    {
      jp: '悪くない。しかし猫様の実力はこんなものではない\n次はもっと人間を翻弄してみせよう',
      en: 'Decent. But the Great Cat is capable of far more.\nNext time, the humans will be toyed with even further.',
    },
  ],
  low: [
    {
      jp: 'なんと、人間如きに追いつかれてしまうとは！\n猫様の名が泣いている…もう一度、格の違いを見せてやれ',
      en: 'Unbelievable! Caught by a mere human?!\nThe cat honor weeps. Go prove your superiority again!',
    },
    {
      jp: '人間ごときに捕まるとは、猫様失格である\nゴロゴロしてる場合ではない、走れ！',
      en: 'Caught by a human? You call yourself a cat?!\nStop purring and RUN!',
    },
  ],
};

export function getResultMessage(score: number): { jp: string; en: string } {
  const tier =
    score >= 3000 ? messages.legend : score >= 2000 ? messages.super : score >= 1000 ? messages.high : score >= 500 ? messages.mid : messages.low;
  return tier[Math.floor(Math.random() * tier.length)];
}
