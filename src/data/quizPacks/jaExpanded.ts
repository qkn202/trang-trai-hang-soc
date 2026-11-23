import { CuratedQuizItem, QuizLexiconEntry } from '../languageQuizBank';
import { buildPackLexicon } from './packHelper';

// +100 từ vựng Tiếng Nhật mở rộng (5 chủ đề × 20 từ: 36 Sơ cấp N5, 40 Trung cấp N4–N3, 24 Cao cấp N2–N1)
export const JA_EXPANDED_LEXICON: QuizLexiconEntry[] = [
  // ==================== 1. GIAO TIẾP, CẢM XÚC & QUAN HỆ (daily — 20 từ) ====================
  ...buildPackLexicon('ja', 1, 'beginner', [
    ['x_tomodachi', '友達 (ともだち)', 'tomodachi', 'danh từ', 'bạn bè', '週末に親友の友達と映画を見に行きます。', 'Shūmatsu ni shin’yū no tomodachi to eiga o mi ni ikimasu.', 'Cuối tuần tôi đi xem phim cùng người bạn thân.'],
    ['x_egao', '笑顔 (えがお)', 'egao', 'danh từ', 'nụ cười tươi', '温かい笑顔は周りの人を幸せにします。', 'Atatakai egao wa mawari no hito o shiawase ni shimasu.', 'Nụ cười ấm áp mang lại niềm vui cho những người xung quanh.'],
    ['x_tanjoubi', '誕生日 (たんじょうび)', 'tanjōbi', 'danh từ', 'ngày sinh nhật', '今夜は妹の誕生日をみんなでお祝いします。', 'Kon’ya wa imōto no tanjōbi o minna de oiwai shimasu.', 'Tối nay cả nhà cùng tổ chức sinh nhật cho em gái.'],
  ], 'daily'),
  ...buildPackLexicon('ja', 2, 'beginner', [
    ['x_ayamaru', '謝る (あやまる)', 'ayamaru', 'động từ', 'xin lỗi', '約束に遅れたのですぐに電話で謝りました。', 'Yakusoku ni okureta node sugu ni denwa de ayamarimashita.', 'Vì trễ hẹn nên tôi gọi điện xin lỗi ngay lập tức.'],
    ['x_wakuwaku', 'わくわく', 'wakuwaku', 'phó từ/động từ', 'hào hứng, rộn ràng mong đợi', '週末の旅行を考えると今からわくわくします。', 'Shūmatsu no ryokō o kangaeru to ima kara wakuwaku shimasu.', 'Nghĩ tới chuyến du lịch cuối tuần mà giờ đã thấy hào hứng rồi.'],
    ['x_dakishimeru', '抱きしめる (だきしめる)', 'dakishimeru', 'động từ', 'ôm chầm lấy', '駅で久しぶりに会った家族をぎゅっと抱きしめました。', 'Eki de hisashiburi ni atta kazoku o gyutto dakishimemashita.', 'Tôi ôm chầm lấy gia đình sau bao ngày gặp lại ở nhà ga.'],
  ], 'daily'),
  ...buildPackLexicon('ja', 3, 'beginner', [
    ['x_shoujiki', '正直 (しょうじき)', 'shōjiki', 'tính từ -na', 'thành thật, trung thực', '正直な気持ちを伝えてくれて本当にありがとう。', 'Shōjiki na kimochi o tsutaete kurete hontō ni arigatō.', 'Cảm ơn bạn đã chia sẻ cảm xúc thật lòng với mình.'],
    ['x_sabishii', '寂しい (さびしい)', 'sabishii', 'tính từ -i', 'cô đơn, buồn vắng', '一人暮らしを始めたばかりの頃は少し寂しかったです。', 'Hitorigurashi o hajimeta bakari no koro wa sukoshi sabishikatta desu.', 'Hồi mới bắt đầu sống một mình tôi thấy hơi cô đơn.'],
  ], 'daily'),
  ...buildPackLexicon('ja', 4, 'intermediate', [
    ['x_hagemasu', '励ます (はげます)', 'hagemasu', 'động từ', 'khích lệ, động viên', '落ち込んでいる仲間を優しい言葉で励ましました。', 'Ochikonde iru nakama o yasashii kotoba de hagemashimashita.', 'Tôi dùng lời ấm áp động viên người đồng đội đang buồn bã.'],
    ['x_hazukashii', '恥ずかしい (はずかしい)', 'hazukashii', 'tính từ -i', 'ngượng ngùng, xấu hổ', '同級生の名前をど忘れしてとても恥ずかしかったです。', 'Dōkyūsei no namae o dowasure shite totemo hazukashikatta desu.', 'Tôi thấy rất ngượng vì bỗng nhiên quên tên bạn cùng lớp.'],
  ], 'daily'),
  ...buildPackLexicon('ja', 5, 'intermediate', [
    ['x_gokai', '誤解 (ごかい)', 'gokai', 'danh từ/động từ', 'sự hiểu lầm', '直接話し合ったおかげで誤解がすっかり解けました。', 'Chokusetsu hanashiatta okage de gokai ga sukkari tokemashita.', 'Nhờ nói chuyện trực tiếp mà hiểu lầm đã hoàn toàn tan biến.'],
    ['x_tanomoshii', '頼もしい (たのもしい)', 'tanomoshii', 'tính từ -i', 'đáng tin cậy, vững chãi', '困った時に必ず助けてくれる頼もしい先輩です。', 'Komatta toki ni kanarazu tasukete kureru tanomoshii senpai desu.', 'Đó là đàn anh đáng tin cậy luôn giúp đỡ mỗi khi khó khăn.'],
  ], 'daily'),
  ...buildPackLexicon('ja', 6, 'intermediate', [
    ['x_dakyou', '妥協 (だきょう)', 'dakyō', 'danh từ/động từ', 'thỏa hiệp, nhượng bộ', '双方が少しずつ譲り合い、納得できる妥協点を見つけました。', 'Sōhō ga sukoshi zutsu yuzuriai, nattoku dekiru dakyōten o mitsukemashita.', 'Hai bên cùng nhường nhau một chút để tìm điểm thỏa hiệp hợp lý.'],
    ['x_taisetsu', '大切 (たいせつ)', 'taisetsu', 'tính từ -na', 'quý giá, trân trọng', '友達と笑い合う何気ない毎日が一番大切です。', 'Tomodachi to waraiau nanigenai mainichi ga ichiban taisetsu desu.', 'Những ngày bình dị cười đùa cùng bạn bè là điều quý giá nhất.'],
  ], 'daily'),
  ...buildPackLexicon('ja', 7, 'intermediate', [
    ['x_nagusameru', '慰める (なぐさめる)', 'nagusameru', 'động từ', 'an ủi, xoa dịu', '温かいお茶を淹れて疲れた友人を静かに慰めました。', 'Atatakai ocha o irete tsukareta yūjin o shizuka ni nagusamemashita.', 'Tôi pha trà ấm và lặng lẽ an ủi người bạn đang mệt mỏi.'],
    ['x_shinrai', '信頼 (しんらい)', 'shinrai', 'danh từ/động từ', 'sự tin tưởng, tín nhiệm', '長い年月をかけて築いた信頼は簡単には崩れません。', 'Nagai nengetsu o kakete kizuita shinrai wa kantan ni wa kuzuremasen.', 'Niềm tin vun đắp qua nhiều năm tháng không dễ gì sụp đổ.'],
  ], 'daily'),
  ...buildPackLexicon('ja', 8, 'advanced', [
    ['x_kyoukan', '共感 (きょうかん)', 'kyōkan', 'danh từ/động từ', 'sự thấu cảm, đồng cảm sâu', '相手の立場に寄り添うことで深い共感が生まれる。', 'Aite no tachiba ni yorisou koto de fukai kyōkan ga umareru.', 'Đặt mình vào hoàn cảnh đối phương sẽ sinh ra sự thấu cảm sâu sắc.'],
    ['x_wakai', '和解 (わかい)', 'wakai', 'danh từ/động từ', 'hòa giải, làm lành', '長年のライバルだった二人は手紙を交わして和解した。', 'Naganen no raibaru datta futari wa tegami o kawashite wakai shita.', 'Hai đối thủ nhiều năm đã trao đổi thư từ và hòa giải với nhau.'],
  ], 'daily'),
  ...buildPackLexicon('ja', 9, 'advanced', [
    ['x_yuuben', '雄弁 (ゆうべん)', 'yūben', 'tính từ -na/danh từ', 'hùng biện, ăn nói lưu loát cuốn hút', '彼女の雄弁なスピーチは講堂の全員を魅了した。', 'Kanojo no yūben na supīchi wa kōdō no zen’in o miryō shita.', 'Bài diễn thuyết hùng hồn của cô ấy làm say mê cả hội trường.'],
  ], 'daily'),
  ...buildPackLexicon('ja', 10, 'advanced', [
    ['x_kizuna', '絆 (きずな)', 'kizuna', 'danh từ', 'sợi dây gắn kết bền chặt', '困難な試練を共に乗り越え、揺るぎない絆が芽生えた。', 'Konnan na shiren o tomo ni norikoe, yuruginai kizuna ga mebaeta.', 'Cùng nhau vượt qua thử thách đã nảy nở sợi dây gắn kết bền chặt.'],
  ], 'daily'),

  // ==================== 2. DU LỊCH, ĂN UỐNG, MUA SẮM & THÀNH PHỐ (travel — 20 từ) ====================
  ...buildPackLexicon('ja', 1, 'beginner', [
    ['x_pasupoto', 'パスポート', 'pasupōto', 'danh từ', 'hộ chiếu', '海外旅行に出かける前にパスポートを確認しました。', 'Kaigai ryokō ni dekakeru mae ni pasupōto o kakunin shimashita.', 'Tôi đã kiểm tra hộ chiếu trước khi lên đường du lịch nước ngoài.'],
    ['x_kuukou', '空港 (くうこう)', 'kūkō', 'danh từ', 'sân bay', '出発の二時間前に国際空港へ到着しました。', 'Shuppatsu no nijikan mae ni kokusai kūkō e tōchaku shimashita.', 'Chúng tôi đã có mặt ở sân bay quốc tế sớm hai tiếng trước giờ bay.'],
    ['x_kippu', '切符 (きっぷ)', 'kippu', 'danh từ', 'tấm vé tàu xe', '改札を通る時に新幹線の切符を見せてください。', 'Kaisatsu o tōru toki ni shinkansen no kippu o misete kudasai.', 'Xin hãy xuất trình vé tàu Shinkansen khi đi qua cửa soát vé.'],
  ], 'travel'),
  ...buildPackLexicon('ja', 2, 'beginner', [
    ['x_hoteru', 'ホテル', 'hoteru', 'danh từ', 'khách sạn', '海が一望できる静かなホテルに二泊しました。', 'Umi ga ichibō dekiru shizuka na hoteru ni nihaku shimashita.', 'Tôi nghỉ hai đêm tại khách sạn yên tĩnh nhìn trọn ra biển.'],
    ['x_menyuu', 'メニュー', 'menyū', 'danh từ', 'thực đơn', 'すみません、英語のメニューも見せていただけますか。', 'Sumimasen, eigo no menyū mo misete itadakemasu ka.', 'Xin lỗi, bạn có thể cho tôi xem thêm thực đơn tiếng Anh không?'],
    ['x_reshito', 'レシート', 'reshīto', 'danh từ', 'hóa đơn thanh toán', 'サイズ交換に必要なのでレシートを大切に保管します。', 'Saizu kōkan ni hitsuyō na node reshīto o taisetsu ni hokan shimasu.', 'Tôi giữ kỹ hóa đơn phòng khi cần đổi kích cỡ áo.'],
  ], 'travel'),
  ...buildPackLexicon('ja', 3, 'beginner', [
    ['x_chikatetsu', '地下鉄 (ちかてつ)', 'chikatetsu', 'danh từ', 'tàu điện ngầm', '通勤ラッシュの時は地下鉄の方がずっと早いです。', 'Tsūkin rasshu no toki wa chikatetsu no hō ga zutto hayai desu.', 'Vào giờ cao điểm đi làm thì tàu điện ngầm nhanh hơn nhiều.'],
    ['x_chizu', '地図 (ちず)', 'chizu', 'danh từ', 'bản đồ', '広場で左に曲がる前に町の地図を確かめましょう。', 'Hiroba de hidari ni magaru mae ni machi no chizu o tashikamemashō.', 'Hãy kiểm tra bản đồ thành phố trước khi rẽ trái ở quảng trường.'],
  ], 'travel'),
  ...buildPackLexicon('ja', 4, 'intermediate', [
    ['x_nimotsu', '荷物 (にもつ)', 'nimotsu', 'danh từ', 'hành lý', '到着ロビーの三番レーンで大きな荷物を受け取りました。', 'Tōchaku robī no sanban rēn de ōkina nimotsu o uketorimashita.', 'Tôi đã nhận hành lý lớn tại băng chuyền số 3 ở sảnh đến.'],
    ['x_yoyaku', '予約 (よやく)', 'yoyaku', 'danh từ/động từ', 'đặt chỗ trước', '今夜七時に四名でレストランの席を予約しました。', 'Kon’ya shichiji ni yonmei de resutoran no seki o yoyaku shimashita.', 'Tôi đã đặt bàn nhà hàng cho 4 người lúc 7 giờ tối nay.'],
  ], 'travel'),
  ...buildPackLexicon('ja', 5, 'intermediate', [
    ['x_shuppatsu', '出発 (しゅっぱつ)', 'shuppatsu', 'danh từ/động từ', 'khởi hành', '電車の出発時刻まであと十分しかありません。', 'Densha no shuppatsu jikoku made ato jippun shika arimasen.', 'Chỉ còn đúng mười phút nữa là tới giờ tàu khởi hành.'],
    ['x_omiyage', 'お土産 (おみやげ)', 'omiyage', 'danh từ', 'quà lưu niệm du lịch', '京都の老舗で家族へのお土産に抹茶菓子を買いました。', 'Kyōto no shinise de kazoku e no omiyage ni matcha-gashi o kaimashita.', 'Tôi mua bánh trà xanh ở tiệm cổ Kyoto làm quà cho gia đình.'],
  ], 'travel'),
  ...buildPackLexicon('ja', 6, 'intermediate', [
    ['x_nittei', '日程 (にってい)', 'nittei', 'danh từ', 'lịch trình du lịch', '五日間の旅行日程に美術館と夜市を組み込みました。', 'Itsukakan no ryokō nittei ni bijutsukan to yoichi o kumikomimashita.', 'Tôi đưa cả bảo tàng và chợ đêm vào lịch trình du lịch năm ngày.'],
    ['x_waribiki', '割引 (わりびき)', 'waribiki', 'danh từ', 'giảm giá, chiết khấu', '学生証を提示すると入場料が二割引になります。', 'Gakuseishō o teiji suru to nyūjōryō ga niwaribiki ni narimasu.', 'Xuất trình thẻ học sinh sẽ được giảm 20% giá vé vào cổng.'],
  ], 'travel'),
  ...buildPackLexicon('ja', 7, 'intermediate', [
    ['x_kousaten', '交差点 (こうさてん)', 'kōsaten', 'danh từ', 'ngã tư giao lộ', '時計台を過ぎて二つ目の交差点を右に曲がってください。', 'Tokeidai o sugite futatsume no kōsaten o migi ni magatte kudasai.', 'Qua tháp đồng hồ rồi rẽ phải ở ngã tư thứ hai nhé.'],
    ['x_ryougae', '両替 (りょうがえ)', 'ryōgae', 'danh từ/động từ', 'đổi ngoại tệ', '旅行前に市内の銀行で現地通貨に両替しました。', 'Ryokō mae ni shinai no ginkō de genchi tsūka ni ryōgae shimashita.', 'Trước chuyến đi tôi đã đổi sang tiền địa phương tại ngân hàng.'],
  ], 'travel'),
  ...buildPackLexicon('ja', 8, 'advanced', [
    ['x_kokusaiteki', '国際的 (こくさいてき)', 'kokusaiteki', 'tính từ -na', 'mang tầm quốc tế, đa văn hóa', 'この港町は多彩な文化が交わる国際的な都市である。', 'Kono minatomachi wa tasai na bunka ga majiwaru kokusaiteki na toshi de aru.', 'Thành phố cảng này là đô thị quốc tế nơi nhiều nền văn hóa giao thoa.'],
    ['x_omotenashi', 'おもてなし', 'omotenashi', 'danh từ', 'lòng hiếu khách tận tâm', '温泉旅館の細やかなおもてなしに心が温まった。', 'Onsen ryokan no komayaka na omotenashi ni kokoro ga atatamatta.', 'Sự hiếu khách tinh tế của lữ quán suối nóng làm ấm lòng du khách.'],
  ], 'travel'),
  ...buildPackLexicon('ja', 9, 'advanced', [
    ['x_tankyuu', '探訪 (たんぼう)', 'tanbō', 'danh từ/động từ', 'chuyến thăm thú tìm hiểu sâu', '歴史ある城下町を歩いて巡る文化探訪に出かけた。', 'Rekishi aru jōkamachi o aruite meguru bunka tanbō ni dekaketa.', 'Tôi lên đường dạo bước khám phá văn hóa khu phố cổ dưới chân thành.'],
  ], 'travel'),
  ...buildPackLexicon('ja', 10, 'advanced', [
    ['x_tabiji', '旅路 (たびじ)', 'tabiji', 'danh từ', 'hành trình lữ thứ', '海辺を走る列車の旅路は生涯忘れられない記憶となった。', 'Umibe o hashiru ressha no tabiji wa shōgai wasurerarenai kioku to natta.', 'Chặng đường tàu chạy ven biển trở thành ký ức cả đời không quên.'],
  ], 'travel'),

  // ==================== 3. HỌC TẬP, CÔNG VIỆC & CÔNG NGHỆ (study_tech — 20 từ) ====================
  ...buildPackLexicon('ja', 1, 'beginner', [
    ['x_noto', 'ノート', 'nōto', 'danh từ', 'quyển vở ghi chép', '新しい単語を毎日ポケットノートに書き留めます。', 'Atarashii tango o mainichi poketto nōto ni kakitomemasu.', 'Mỗi ngày tôi đều chép từ mới vào cuốn sổ tay bỏ túi.'],
    ['x_toshokan', '図書館 (としょかん)', 'toshokan', 'danh từ', 'thư viện', '放課後は静かな図書館で自習する学生が多いです。', 'Hōkago wa shizuka na toshokan de jishū suru gakusei ga ōi desu.', 'Sau giờ học rất nhiều học sinh tự học yên tĩnh tại thư viện.'],
    ['x_messeji', 'メッセージ', 'messēji', 'danh từ', 'tin nhắn', '家に着いたらすぐにメッセージを送ってくださいね。', 'Ie ni tsuitara sugu ni messēji o okutte kudasai ne.', 'Về tới nhà nhớ gửi tin nhắn cho mình ngay nhé.'],
  ], 'study_tech'),
  ...buildPackLexicon('ja', 2, 'beginner', [
    ['x_kibodo', 'キーボード', 'kībōdo', 'danh từ', 'bàn phím', '軽くて静かなワイヤレスキーボードに買い替えました。', 'Karukute shizuka na waiyaresu kībōdo ni kaikaemashita.', 'Tôi đã đổi sang chiếc bàn phím không dây vừa nhẹ vừa êm.'],
    ['x_pasuwado', 'パスワード', 'pasuwādo', 'danh từ', 'mật khẩu', 'アカウントのパスワードは他人に絶対に教えないでください。', 'Akaunto no pasuwādo wa tanin ni zettai ni oshienaide kudasai.', 'Tuyệt đối không tiết lộ mật khẩu tài khoản cho người khác.'],
  ], 'study_tech'),
  ...buildPackLexicon('ja', 3, 'beginner', [
    ['x_shukudai', '宿題 (しゅくだい)', 'shukudai', 'danh từ', 'bài tập về nhà', 'ゲームをする前に今日の数学の宿題を終わらせます。', 'Gēmu o suru mae ni kyō no sūgaku no shukudai o owarasemasu.', 'Tôi sẽ làm xong bài tập toán hôm nay trước khi chơi game.'],
    ['x_kaigi', '会議 (かいぎ)', 'kaigi', 'danh từ', 'cuộc họp', 'チームの朝会議は毎朝九時ちょうどに始まります。', 'Chīmu no asakaigi wa maiasa kuji chōdo ni hajimarimasu.', 'Cuộc họp sáng của nhóm bắt đầu đúng chín giờ mỗi ngày.'],
  ], 'study_tech'),
  ...buildPackLexicon('ja', 4, 'intermediate', [
    ['x_shimekiri', '締切 (しめきり)', 'shimekiri', 'danh từ', 'hạn chót nộp bài/báo cáo', 'デザイン班は締切より二日早く報告書を提出しました。', 'Dezain-han wa shimekiri yori futsuka hayaku hōkokusho o teishutsu shimashita.', 'Nhóm thiết kế nộp báo cáo sớm hơn hạn chót tận hai ngày.'],
    ['x_douryou', '同僚 (どうりょう)', 'dōryō', 'danh từ', 'đồng nghiệp', '親切な同僚が便利な表計算の操作を教えてくれました。', 'Shinsetsu na dōryō ga benri na hyōkeisan no sōsa o oshiete kuremashita.', 'Người đồng nghiệp tốt bụng đã chỉ tôi mẹo dùng bảng tính rất tiện.'],
  ], 'study_tech'),
  ...buildPackLexicon('ja', 5, 'intermediate', [
    ['x_shougakukin', '奨学金 (しょうがくきん)', 'shōgakukin', 'danh từ', 'học bổng', '優秀な論文が評価され、大学の奨学金を獲得しました。', 'Yūshū na ronbun ga hyōka sare, daigaku no shōgakukin o kakutoku shimashita.', 'Bài luận xuất sắc được đánh giá cao giúp cô giành học bổng đại học.'],
    ['x_tsuuchi', '通知 (つうち)', 'tsūchi', 'danh từ', 'thông báo ứng dụng', '試験勉強に集中したい時はスマホの通知を切っておきます。', 'Shiken benkyō ni shūchū shitai toki wa sumaho no tsūchi o kitte okimasu.', 'Khi muốn tập trung ôn thi hãy tắt thông báo điện thoại trước.'],
  ], 'study_tech'),
  ...buildPackLexicon('ja', 6, 'intermediate', [
    ['x_happyou', '発表 (はっぴょう)', 'happyō', 'danh từ/động từ', 'bài thuyết trình, công bố', 'セミナーの前にスライド発表を二回練習しました。', 'Seminā no mae ni suraido happyō o nikai renshū shimashita.', 'Trước buổi hội thảo anh ấy tập dượt bài thuyết trình hai lần.'],
    ['x_ikenshoku', 'フィードバック', 'fīdobakku', 'danh từ', 'phản hồi, góp ý', '建設的なフィードバックのおかげで企画が洗練されました。', 'Kensetsuteki na fīdobakku no okage de kikaku ga senren saremashita.', 'Nhờ góp ý mang tính xây dựng mà bản kế hoạch thêm sắc sảo.'],
  ], 'study_tech'),
  ...buildPackLexicon('ja', 7, 'intermediate', [
    ['x_arugorizumu', 'アルゴリズム', 'arugorizumu', 'danh từ', 'thuật toán', '新しい検索アルゴリズムが正確な答えを瞬時に見つけます。', 'Atarashii kensaku arugorizumu ga seikaku na kotae o shunji ni mitsukemasu.', 'Thuật toán tìm kiếm mới tìm ra đáp án chính xác trong nháy mắt.'],
    ['x_apuri', 'アプリ', 'apuri', 'danh từ', 'ứng dụng phần mềm', 'この語学アプリは毎日の復習記録を自動で管理してくれます。', 'Kono gogaku apuri wa mainichi no fukushū kiroku o jidō de kanri shite kuremasu.', 'Ứng dụng ngoại ngữ này tự quản lý tiến độ ôn tập mỗi ngày.'],
  ], 'study_tech'),
  ...buildPackLexicon('ja', 8, 'advanced', [
    ['x_kakushin', '革新 (かくしん)', 'kakushin', 'danh từ', 'sự đổi mới cách tân', 'クリーンエネルギーの技術革新が現代都市を変えつつある。', 'Kurīn enerugī no gijutsu kakushin ga gendai toshi o kaetsutsu aru.', 'Đổi mới công nghệ năng lượng sạch đang biến đổi các đô thị hiện đại.'],
    ['x_angouka', '暗号化 (あんごうか)', 'angōka', 'danh từ/động từ', 'mã hóa bảo mật', '強固な暗号化によって個人メッセージの安全性が守られる。', 'Kyōko na angōka ni yotte kojin messēji no anzensei ga mamorareru.', 'Nhờ mã hóa vững chắc mà độ an toàn của tin nhắn cá nhân được bảo vệ.'],
  ], 'study_tech'),
  ...buildPackLexicon('ja', 9, 'advanced', [
    ['x_jukutatsu', '熟達 (じゅくたつ)', 'jukutatsu', 'danh từ/động từ', 'sự tinh thông, thành thạo cao', '毎日の会話練習こそが外国語熟達への確かな道である。', 'Mainichi no kaiwa renshū koso ga gaikokugo jukutatsu e no tashika na michi de aru.', 'Luyện giao tiếp mỗi ngày chính là con đường chắc chắn để tinh thông ngoại ngữ.'],
    ['x_jidouka', '自動化 (じどうか)', 'jidōka', 'danh từ/động từ', 'tự động hóa', '反復作業の自動化により開発チームの効率が飛躍的に高まった。', 'Hanpuku sagyō no jidōka ni yori kaihatsu chīmu no kōritsu ga hiyakuteki ni takamatta.', 'Tự động hóa tác vụ lặp giúp hiệu suất nhóm phát triển tăng vọt.'],
  ], 'study_tech'),
  ...buildPackLexicon('ja', 10, 'advanced', [
    ['x_paradaimu', 'パラダイム', 'paradaimu', 'danh từ', 'hệ hình tư duy mới', '人工知能の進歩は情報科学に新たなパラダイムをもたらした。', 'Jinkō chinō no shinpo wa jōhō kagaku ni arata na paradaimu o motarashita.', 'Bước tiến của AI đã mở ra một hệ hình mới cho khoa học thông tin.'],
  ], 'study_tech'),

  // ==================== 4. SỨC KHỎE, THỂ THAO, ÂM NHẠC & GIẢI TRÍ (health_hobby — 20 từ) ====================
  ...buildPackLexicon('ja', 1, 'beginner', [
    ['x_byouin', '病院 (びょういん)', 'byōin', 'danh từ', 'bệnh viện', '中央病院は二十四時間いつでも救急を受け付けています。', 'Chūō byōin wa nijūyojikan itsudemo kyūkyū o uketsukete imasu.', 'Bệnh viện trung tâm tiếp nhận cấp cứu 24 giờ mỗi ngày.'],
    ['x_netsu', '熱 (ねつ)', 'netsu', 'danh từ', 'cơn sốt', '熱がある時は水分をたくさんとってゆっくり休みましょう。', 'Netsu ga aru toki wa suibun o takusan totte yukkuri yasumimashō.', 'Khi bị sốt hãy uống nhiều nước và nghỉ ngơi thoải mái.'],
    ['x_gita', 'ギター', 'gitā', 'danh từ', 'đàn ghi-ta', '毎週末、公園のベンチでアコースティックギターを弾きます。', 'Maishūmatsu, kōen no benchi de akōsutikku gitā o hikimasu.', 'Mỗi cuối tuần tôi chơi đàn ghi-ta mộc trên ghế công viên.'],
  ], 'health_hobby'),
  ...buildPackLexicon('ja', 2, 'beginner', [
    ['x_kusuri', '薬 (くすり)', 'kusuri', 'danh từ', 'thuốc chữa bệnh', '先生の指示どおり、食後にこの薬を飲んでください。', 'Sensei no shijidōri, shokugo ni kono kusuri o nonde kudasai.', 'Hãy uống thuốc này sau bữa ăn đúng theo chỉ dẫn bác sĩ.'],
    ['x_konsato', 'コンサート', 'konsāto', 'danh từ', 'buổi hòa nhạc', '交響楽団のコンサートチケットは十分で完売しました。', 'Kōkyō gakudan no konsāto chiketto wa jippun de kanbai shimashita.', 'Vé hòa nhạc giao hưởng đã bán sạch chỉ trong mười phút.'],
  ], 'health_hobby'),
  ...buildPackLexicon('ja', 3, 'beginner', [
    ['x_suiei', '水泳 (すいえい)', 'suiei', 'danh từ', 'môn bơi lội', '朝の水泳を続けると肩こりも軽くなります。', 'Asa no suiei o tsuzukeru to katakori mo karuku narimasu.', 'Duy trì bơi buổi sáng giúp mỏi vai gáy cũng nhẹ hẳn đi.'],
    ['x_kamera', 'カメラ', 'kamera', 'danh từ', 'máy ảnh', '古いフィルムカメラを持って夕暮れの街を歩きました。', 'Furui firumu kamera o motte yūgure no machi o arukimashita.', 'Tôi mang chiếc máy ảnh phim cổ đi dạo phố lúc hoàng hôn.'],
  ], 'health_hobby'),
  ...buildPackLexicon('ja', 4, 'intermediate', [
    ['x_eiyou', '栄養 (えいよう)', 'eiyō', 'danh từ', 'dinh dưỡng', 'バランスの良い栄養と十分な睡眠が集中力を高めます。', 'Baransu no yoi eiyō to jūbun na suimin ga shūchūryoku o takamemasu.', 'Dinh dưỡng cân bằng và ngủ đủ giấc nâng cao độ tập trung.'],
    ['x_senritsu', '旋律 (せんりつ)', 'senritsu', 'danh từ', 'giai điệu', '優しいピアノの旋律が一日中頭から離れません。', 'Yasashii piano no senritsu ga ichinichijū atama kara hanaremasen.', 'Giai điệu piano dịu nhẹ ấy cứ ngân vang trong đầu tôi cả ngày.'],
  ], 'health_hobby'),
  ...buildPackLexicon('ja', 5, 'intermediate', [
    ['x_tairyoku', '体力 (たいりょく)', 'tairyoku', 'danh từ', 'thể lực, sức bền', 'ジョギングを習慣にしてから体力がぐんとつきました。', 'Jogingu o shūkan ni shite kara tairyoku ga gunto tsukimashita.', 'Từ khi tạo thói quen chạy bộ thể lực tôi tăng lên rõ rệt.'],
    ['x_kantoku', '監督 (かんとく)', 'kantoku', 'danh từ', 'đạo diễn, huấn luyện viên', 'この映画監督は美しい映像表現で国際賞を受賞しました。', 'Kono eiga kantoku wa utsukushii eizō hyōgen de kokusaishō o jushō shimashita.', 'Vị đạo diễn phim này đoạt giải quốc tế nhờ khung hình tuyệt đẹp.'],
  ], 'health_hobby'),
  ...buildPackLexicon('ja', 6, 'intermediate', [
    ['x_shohousen', '処方箋 (しょほうせん)', 'shohōsen', 'danh từ', 'đơn thuốc của bác sĩ', '病院でもらった処方箋を角の薬局へ持って行きました。', 'Byōin de moratta shohōsen o kado no yakkyoku e motte ikimashita.', 'Tôi mang đơn thuốc bác sĩ kê tới hiệu thuốc ở góc phố.'],
    ['x_tenrankai', '展覧会 (てんらんかい)', 'tenrankai', 'danh từ', 'buổi triển lãm', '今週の土曜日から美術館で現代アートの展覧会が始まります。', 'Konshū no doyōbi kara bijutsukan de gendai āto no tenrankai ga hajimarimasu.', 'Từ thứ Bảy tuần này bảo tàng mở triển lãm nghệ thuật đương đại.'],
  ], 'health_hobby'),
  ...buildPackLexicon('ja', 7, 'intermediate', [
    ['x_marason', 'マラソン', 'marason', 'danh từ', 'cuộc chạy ma-ra-tông', '半年間トレーニングを重ねて初の市民マラソンを完走しました。', 'Hantoshikan torēningu o kasanete hatsu no shimin marason o kansō shimashita.', 'Tập luyện suốt nửa năm và tôi đã hoàn thành giải ma-ra-tông đầu tiên.'],
    ['x_meisou', '瞑想 (めいそう)', 'meisō', 'danh từ/động từ', 'thiền định, tĩnh tâm', '朝の十分間の瞑想が忙しい心を穏やかに整えてくれます。', 'Asa no jippunkan no meisō ga isogashii kokoro o odayaka ni totonoete kuremasu.', 'Mười phút thiền buổi sáng giúp tâm trí bận rộn trở nên thanh thản.'],
  ], 'health_hobby'),
  ...buildPackLexicon('ja', 8, 'advanced', [
    ['x_meneki', '免疫力 (めんえきりょく)', 'men’ekiryoku', 'danh từ', 'sức đề kháng, miễn dịch', '適度な運動を継続することで自然な免疫力が高まる。', 'Tekido na undō o keizoku suru koto de shizen na men’ekiryoku ga takamaru.', 'Duy trì vận động vừa sức giúp nâng cao hệ miễn dịch tự nhiên.'],
    ['x_kessaku', '傑作 (けっさく)', 'kessaku', 'danh từ', 'kiệt tác nghệ thuật', '評論家たちはそのアニメ映画を不朽の傑作と称えた。', 'Hyōronkatachi wa sono anime eiga o fukyū no kessaku to tataeta.', 'Giới phê bình ca ngợi bộ phim hoạt hình ấy là kiệt tác bất hủ.'],
  ], 'health_hobby'),
  ...buildPackLexicon('ja', 9, 'advanced', [
    ['x_furitsuke', '振り付け (ふりつけ)', 'furitsuke', 'danh từ', 'biên đạo múa, vũ đạo', '息の合った華麗な振り付けが観客の喝采を浴びた。', 'Iki no atta karei na furitsuke ga kankyaku no kassai o abita.', 'Màn vũ đạo lộng lẫy ăn ý nhận được tràng pháo tay vang dội.'],
    ['x_rihabiri', 'リハビリ', 'rihabiri', 'danh từ', 'phục hồi chức năng', '地道なリハビリを乗り越えて選手は再びコートに立った。', 'Jimichi na rihabiri o norikoete senshu wa futatabi kōto ni tatta.', 'Vượt qua quá trình phục hồi bền bỉ, vận động viên đã trở lại sân đấu.'],
  ], 'health_hobby'),
  ...buildPackLexicon('ja', 10, 'advanced', [
    ['x_katarushisu', 'カタルシス', 'katarushisu', 'danh từ', 'sự giải tỏa cảm xúc qua nghệ thuật', '圧巻の最終幕は観客に深いカタルシスをもたらした。', 'Akkan no saishūmaku wa kankyaku ni fukai katarushisu o motarashita.', 'Màn kết ngoạn mục mang đến cho khán giả sự giải tỏa cảm xúc sâu lắng.'],
  ], 'health_hobby'),

  // ==================== 5. THẾ GIỚI HARRY POTTER & PHÉP THUẬT (magic — 20 từ) ====================
  ...buildPackLexicon('ja', 1, 'beginner', [
    ['x_tsue', '魔法の杖 (まほうのつえ)', 'mahō no tsue', 'danh từ', 'đũa phép', '杖が自ら魔法使いを選ぶと教えられました。', 'Tsue ga mizukara mahōtsukai o erabu to oshieraremashita.', 'Chúng tôi được dạy rằng chính đũa phép sẽ chọn chủ nhân của mình.'],
    ['x_jumon', '呪文 (じゅもん)', 'jumon', 'danh từ', 'thần chú, câu bùa', '光の呪文を唱える時は発音をはっきりさせましょう。', 'Hikari no jumon o tonaeru toki wa hatsuon o hakkiri sasemashō.', 'Khi niệm thần chú ánh sáng hãy phát âm thật rõ ràng.'],
  ], 'magic'),
  ...buildPackLexicon('ja', 2, 'beginner', [
    ['x_houki', '魔法の箒 (まほうのほうき)', 'mahō no hōki', 'danh từ', 'chổi bay phép thuật', '一年生が中庭で魔法の箒に乗る練習をしています。', 'Ichinensei ga nakaniwa de mahō no hōki ni noru renshū o shite imasu.', 'Học sinh năm nhất đang tập cưỡi chổi bay ở sân trong.'],
    ['x_mahouyaku', '魔法薬 (まほうやく)', 'mahōyaku', 'danh từ', 'độc dược, thuốc phép', '銀色の大鍋で魔法薬を反時計回りに三回混ぜます。', 'Gin’iro no ōnabe de mahōyaku o hantokeimawari ni sankai mazemasu.', 'Khuấy bình độc dược trong chiếc vạc bạc ba vòng ngược chiều kim đồng hồ.'],
  ], 'magic'),
  ...buildPackLexicon('ja', 3, 'beginner', [
    ['x_manto', '透明マント (とうめいマント)', 'tōmei manto', 'danh từ', 'áo choàng tàng hình', '透明マントを羽織れば夜の廊下でも誰にも見えません。', 'Tōmei manto o haoreba yoru no rōka demo dare ni mo miemasen.', 'Khoác áo choàng tàng hình lên thì đi hành lang đêm cũng không ai thấy.'],
    ['x_shiro', '城 (しろ)', 'shiro', 'danh từ', 'lâu đài cổ kính', '湖の向こうに松明が揺れる石造りの城がそびえています。', 'Mizuumi no mukō ni taimatsu ga yureru ishizukuri no shiro ga sobiete imasu.', 'Bên kia hồ sừng sững tòa lâu đài đá lung linh ánh đuốc.'],
  ], 'magic'),
  ...buildPackLexicon('ja', 4, 'intermediate', [
    ['x_shugorei', '守護霊 (しゅごれい)', 'shugorei', 'danh từ', 'thần hộ mệnh', '最も幸せな記憶を思い浮かべて銀色の守護霊を呼び出します。', 'Mottomo shiawase na kioku o omoiukabete gin’iro no shugorei o yobidashimasu.', 'Nghĩ về ký ức hạnh phúc nhất để triệu hồi thần hộ mệnh ánh bạc.'],
    ['x_ryou', '寮 (りょう)', 'ryō', 'danh từ', 'ký túc xá Nhà học viện', '寮の談話室では毎晩暖炉の火が心地よく燃えています。', 'Ryō no danwashitsu de wa maiban danro no hi ga kokochiyoku moete imasu.', 'Trong phòng sinh hoạt chung ký túc xá, lò sưởi cháy ấm áp mỗi đêm.'],
  ], 'magic'),
  ...buildPackLexicon('ja', 5, 'intermediate', [
    ['x_yogen', '予言 (よげん)', 'yogen', 'danh từ', 'lời tiên tri', '淡く光る水晶玉の中に古い予言が眠っていました。', 'Awaku hikaru suishōdama no naka ni furui yogen ga nemutte imashita.', 'Bên trong quả cầu pha lê phát sáng dịu là một lời tiên tri cổ xưa.'],
    ['x_kettou', '決闘 (けっとう)', 'kettō', 'danh từ/động từ', 'trận đấu tay đôi pháp thuật', '親善決闘の前に二人の主将が礼儀正しくお辞儀をしました。', 'Shinzen kettō no mae ni futari no shushō ga reigitadashiku ojigi o shimashita.', 'Trước trận đấu tay đôi giao hữu hai đội trưởng cúi chào lịch thiệp.'],
  ], 'magic'),
  ...buildPackLexicon('ja', 6, 'intermediate', [
    ['x_renkinjutsu', '錬金術 (れんきんじゅつ)', 'renkinjutsu', 'danh từ', 'thuật giả kim', '研究者たちは図書館の閲覧制限棚で錬金術を調べました。', 'Kenkyūshatachi wa toshokan no etsuran seigendana de renkinjutsu o shirabemashita.', 'Các học giả tra cứu thuật giả kim ở khu sách hạn chế của thư viện.'],
    ['x_kouchou', '校長 (こうちょう)', 'kōchō', 'danh từ', 'hiệu trưởng', '賢明な校長先生が始業式の晩餐会で挨拶されました。', 'Kenmei na kōchō-sensei ga shigyōshiki no bansankai de aisatsu saremashita.', 'Thầy hiệu trưởng thông thái phát biểu chào mừng tại tiệc khai giảng.'],
  ], 'magic'),
  ...buildPackLexicon('ja', 7, 'intermediate', [
    ['x_omamori', 'お守り (おまもり)', 'omamori', 'danh từ', 'bùa hộ mệnh', '長い旅の無事を願って銀の不死鳥のお守りを身につけています。', 'Nagai tabi no buji o negatte gin no fushichō no omamori o mi ni tsukete imasu.', 'Tôi đeo chiếc bùa hộ mệnh phượng hoàng bạc cầu bình an đường xa.'],
    ['x_madousho', '魔導書 (まどうしょ)', 'madōsho', 'danh từ', 'sách thần chú cổ', '古い魔導書の余白には先輩の手書きメモがびっしり残っています。', 'Furui madōsho no yohaku ni wa senpai no tegaki memo ga bisshiri nokotte imasu.', 'Lề quyển sách phép cổ vẫn còn dày đặc ghi chú viết tay của đàn anh.'],
  ], 'magic'),
  ...buildPackLexicon('ja', 8, 'advanced', [
    ['x_henshinjutsu', '変身術 (へんしんじゅつ)', 'henshinjutsu', 'danh từ', 'môn biến hình pháp thuật', '変身術の授業では高い集中力と緻密な正確さが求められる。', 'Henshinjutsu no jugyō de wa takai shūchūryoku to chimitsu na seikakusa ga motomerareru.', 'Trong tiết Biến hình đòi hỏi độ tập trung cao và sự chuẩn xác tỉ mỉ.'],
    ['x_eishou', '詠唱 (えいしょう)', 'eishō', 'danh từ/động từ', 'ngâm niệm thần chú cổ', 'わずか一音の詠唱の誤りでも魔法は火花から煙へと変わってしまう。', 'Wazuka ichion no eishō no ayamari demo mahō wa hibana kara kemuri e to kawatte shimau.', 'Chỉ sai một âm khi niệm chú cũng khiến tia lửa hóa thành làn khói.'],
  ], 'magic'),
  ...buildPackLexicon('ja', 9, 'advanced', [
    ['x_fuyuu', '浮遊呪文 (ふゆうじゅもん)', 'fuyū jumon', 'danh từ', 'bùa bay lơ lửng', '手首を軽く振るだけで羽根を浮かべる浮遊呪文を体得した。', 'Tekubi o karuku furu dake de hane o ukaberu fuyū jumon o taitoku shita.', 'Chỉ cần vẩy nhẹ cổ tay là tôi đã làm chủ được bùa bay lơ lửng.'],
    ['x_shunkan', '姿くらまし (すがたくらまし)', 'sugata kuramashi', 'danh từ', 'độn thổ, dịch chuyển tức thời', '姿くらましを行うには厳格な免許試験に合格しなければならない。', 'Sugata kuramashi o okonau ni wa genkaku na menkyo shiken ni gōkaku shinakereba naranai.', 'Muốn thực hiện độn thổ phải vượt qua kỳ thi cấp bằng khắt khe.'],
  ], 'magic'),
  ...buildPackLexicon('ja', 10, 'advanced', [
    ['x_senrigan', '千里眼 (せんりがん)', 'senrigan', 'danh từ', 'nhãn thông, năng lực thấu thị', '真の千里眼は茶葉を眺めるだけでは決して得られない。', 'Shin no senrigan wa chaba o nagameru dake de wa kesshite erarenai.', 'Khả năng thấu thị thực thụ không bao giờ có được chỉ bằng nhìn lá trà.'],
    ['x_hijutsu', '秘術 (ひじゅつ)', 'hijutsu', 'danh từ', 'bí thuật pháp sư cổ đại', '古代の年代記には城壁を守る伝説の秘術が記されている。', 'Kodai no nendaiki ni wa jōheki o mamoru densetsu no hijutsu ga shirusarete iru.', 'Biên niên sử cổ chép về bí thuật huyền thoại bảo vệ tường thành.'],
  ], 'magic'),
];

export const JA_EXPANDED_CURATED: CuratedQuizItem[] = [
  {
    id: 'ja_x_daily_dial_1',
    lang: 'ja',
    tier: 'beginner',
    levelBand: 2,
    topic: 'daily',
    format: 'dialogue_reply',
    promptVi: 'Bạn thân xin lỗi vì tàu đến muộn — chọn lời đáp tự nhiên và ấm áp nhất:',
    stemText: '友達：「ごめん、電車が遅れて少し遅刻しちゃった！」',
    stemPhonetic: 'Gomen, densha ga okurete sukoshi chikoku shichatta!',
    fullSentence: '全然大丈夫だよ、私も今着いたばかり！',
    fullPhonetic: 'Zenzen daijōbu da yo, watashi mo ima tsuita bakari!',
    translationVi: 'Không sao đâu mà, mình cũng vừa mới tới thôi!',
    choices: [
      '全然大丈夫だよ、私も今着いたばかり！',
      '空港の出発口は三階です。',
      'レシートは財布に入れました。',
      '図書館は月曜日が休みです。',
    ],
    correctIndex: 0,
    grammarTitleVi: 'Mẫu V-たばかり (vừa mới làm gì xong) khi đáp lời xin lỗi',
    grammarExplainVi: '"着いたばかり" (vừa mới tới) kết hợp "全然大丈夫だよ" (hoàn toàn không sao đâu) là cách đáp lại cực kỳ thân thiện và tự nhiên trong hội thoại tiếng Nhật.',
    vocabNotes: [
      { word: '大丈夫 (だいじょうぶ)', phonetic: 'daijōbu', posVi: 'tính từ -na', meaningVi: 'ổn, không sao đâu' },
      { word: '〜たばかり', phonetic: '-ta bakari', posVi: 'ngữ pháp', meaningVi: 'vừa mới xong' },
    ],
  },
  {
    id: 'ja_x_travel_cloze_1',
    lang: 'ja',
    tier: 'intermediate',
    levelBand: 4,
    topic: 'travel',
    format: 'grammar_cloze',
    promptVi: 'Chọn trợ từ/cụm hỏi đường lịch sự đến ga tàu điện ngầm gần nhất:',
    stemText: 'すみません、一番近い地下鉄の駅へは____行けばいいですか。',
    stemPhonetic: 'Sumimasen, ichiban chikai chikatetsu no eki e wa ____ ikeba ii desu ka.',
    fullSentence: 'すみません、一番近い地下鉄の駅へはどう行けばいいですか。',
    fullPhonetic: 'Sumimasen, ichiban chikai chikatetsu no eki e wa dō ikeba ii desu ka.',
    translationVi: 'Xin lỗi, muốn đi tới ga tàu điện ngầm gần nhất thì đi thế nào ạ?',
    choices: ['どう', 'だれ', 'いつ', 'いくら'],
    choicePhonetics: ['dō', 'dare', 'itsu', 'ikura'],
    correctIndex: 0,
    grammarTitleVi: 'Mẫu hỏi đường JLPT N4: どう + V-ばいいですか (Đi thế nào thì được?)',
    grammarExplainVi: 'Từ nghi vấn "どう" (như thế nào) đi kèm thể điều kiện "行けばいいですか" là mẫu câu chuẩn mực nhất để hỏi phương hướng khi du lịch Nhật Bản.',
    vocabNotes: [
      { word: '地下鉄 (ちかてつ)', phonetic: 'chikatetsu', posVi: 'danh từ', meaningVi: 'tàu điện ngầm' },
      { word: 'どう行けばいい', phonetic: 'dō ikeba ii', posVi: 'cụm hỏi đường', meaningVi: 'nên đi như thế nào' },
    ],
  },
  {
    id: 'ja_x_tech_sent_1',
    lang: 'ja',
    tier: 'intermediate',
    levelBand: 5,
    topic: 'study_tech',
    format: 'sentence_builder',
    promptVi: 'Sắp xếp các thẻ từ để nói: "Hãy hoàn thành bài thuyết trình trước hạn chót."',
    stemText: 'Hãy hoàn thành bài thuyết trình trước hạn chót.',
    fullSentence: '締切の前に発表の準備を終えましょう。',
    fullPhonetic: 'Shimekiri no mae ni happyō no junbi o oemashō.',
    translationVi: 'Chúng ta hãy hoàn thành khâu chuẩn bị thuyết trình trước hạn chót.',
    orderedTokens: ['締切の', '前に', '発表の', '準備を', '終えましょう。'],
    distractorTokens: ['後に'],
    grammarTitleVi: 'Thời hạn Nの前に (trước khi) + thể đề nghị V-ましょう',
    grammarExplainVi: '"締切の前に" (trước hạn chót) bổ nghĩa thời gian đứng đầu câu, theo sau là tân ngữ "発表の準備を" và động từ đề nghị "終えましょう".',
    vocabNotes: [
      { word: '締切 (しめきり)', phonetic: 'shimekiri', posVi: 'danh từ', meaningVi: 'hạn chót' },
      { word: '発表 (はっぴょう)', phonetic: 'happyō', posVi: 'danh từ', meaningVi: 'bài thuyết trình' },
    ],
  },
  {
    id: 'ja_x_health_cloze_1',
    lang: 'ja',
    tier: 'intermediate',
    levelBand: 6,
    topic: 'health_hobby',
    format: 'grammar_cloze',
    promptVi: 'Chọn cấu trúc chỉ mục đích rèn luyện thể lực:',
    stemText: '体力をつける____、毎朝三十分泳いでいます。',
    stemPhonetic: 'Tairyoku o tsukeru ____, maiasa sanjippun oyoide imasu.',
    fullSentence: '体力をつけるために、毎朝三十分泳いでいます。',
    fullPhonetic: 'Tairyoku o tsukeru tame ni, maiasa sanjippun oyoide imasu.',
    translationVi: 'Để tăng cường thể lực, mỗi sáng tôi bơi ba mươi phút.',
    choices: ['ために', 'のに', 'くせに', 'ばかりに'],
    choicePhonetics: ['tame ni', 'noni', 'kuse ni', 'bakari ni'],
    correctIndex: 0,
    grammarTitleVi: 'Cấu trúc mục đích JLPT N4–N3: V-る + ために (để mà...)',
    grammarExplainVi: 'Động từ thể từ điển "つける" + "ために" diễn tả mục tiêu chủ ý rõ ràng (để có thể lực) cho thói quen bơi mỗi sáng.',
    vocabNotes: [
      { word: '体力 (たいりょく)', phonetic: 'tairyoku', posVi: 'danh từ', meaningVi: 'thể lực' },
      { word: 'ために', phonetic: 'tame ni', posVi: 'ngữ pháp', meaningVi: 'để, vì mục đích' },
    ],
  },
  {
    id: 'ja_x_magic_cloze_1',
    lang: 'ja',
    tier: 'advanced',
    levelBand: 8,
    topic: 'magic',
    format: 'grammar_cloze',
    promptVi: 'Chọn ngữ pháp JLPT N2 nhấn mạnh năng lực thần chú Hogwarts:',
    stemText: '彼女は古い呪文を正確に詠唱できる____、無言呪文までも使いこなす。',
    stemPhonetic: 'Kanojo wa furui jumon o seikaku ni eishō dekiru ____, mugon jumon made mo tsukaikonasu.',
    fullSentence: '彼女は古い呪文を正確に詠唱できるばかりでなく、無言呪文までも使いこなす。',
    fullPhonetic: 'Kanojo wa furui jumon o seikaku ni eishō dekiru bakari de naku, mugon jumon made mo tsukaikonasu.',
    translationVi: 'Cô ấy không những niệm chuẩn xác thần chú cổ mà còn sử dụng thành thạo cả bùa chú không lời.',
    choices: ['ばかりでなく', 'わけではなく', 'にもかかわらず', 'ことには'],
    choicePhonetics: ['bakari de naku', 'wake de wa naku', 'ni mo kakawarazu', 'koto ni wa'],
    correctIndex: 0,
    grammarTitleVi: 'Ngữ pháp N2: 〜ばかりでなく〜も (Không chỉ... mà còn...)',
    grammarExplainVi: '"〜ばかりでなく" nối hai vế tăng tiến, nhấn mạnh ngoài khả năng niệm chú chuẩn xác, cô còn làm chủ cả bùa chú không lời.',
    vocabNotes: [
      { word: '詠唱 (えいしょう)', phonetic: 'eishō', posVi: 'danh từ/động từ', meaningVi: 'niệm thần chú' },
      { word: '使いこなす', phonetic: 'tsukaikonasu', posVi: 'động từ', meaningVi: 'sử dụng thành thạo bậc thầy' },
    ],
  },
];
