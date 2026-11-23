import { CuratedQuizItem, QuizLexiconEntry } from '../languageQuizBank';
import { buildPackLexicon } from './packHelper';

// +100 từ vựng Tiếng Anh mở rộng (5 chủ đề × 20 từ: 36 Sơ cấp, 40 Trung cấp, 24 Cao cấp)
export const EN_EXPANDED_LEXICON: QuizLexiconEntry[] = [
  // ==================== 1. GIAO TIẾP, CẢM XÚC & QUAN HỆ (daily — 20 từ) ====================
  ...buildPackLexicon('en', 1, 'beginner', [
    ['x_friend', 'friend', '/frɛnd/', 'danh từ', 'người bạn', 'My best friend always listens when I feel sad.', '/maɪ bɛst frɛnd ˈɔːlweɪz ˈlɪsənz wɛn aɪ fiːl sæd/', 'Người bạn thân nhất của tôi luôn lắng nghe mỗi khi tôi buồn.'],
    ['x_smile', 'smile', '/smaɪl/', 'danh từ/động từ', 'nụ cười, mỉm cười', 'A warm smile makes newcomers feel welcome right away.', '/ə wɔːrm smaɪl meɪks ˈnuːkʌmərz fiːl ˈwɛlkəm raɪt əˈweɪ/', 'Một nụ cười ấm áp khiến người mới đến thấy được chào đón ngay.'],
    ['x_birthday', 'birthday', '/ˈbɜːrθdeɪ/', 'danh từ', 'ngày sinh nhật', 'We planned a surprise party for her birthday tonight.', '/wiː plænd ə sərˈpraɪz ˈpɑːrti fɔːr hɜːr ˈbɜːrθdeɪ təˈnaɪt/', 'Chúng tôi chuẩn bị một bữa tiệc bất ngờ cho sinh nhật cô ấy tối nay.'],
  ], 'daily'),
  ...buildPackLexicon('en', 2, 'beginner', [
    ['x_apologize', 'apologize', '/əˈpɒlədʒaɪz/', 'động từ', 'xin lỗi', 'He called immediately to apologize for arriving late.', '/hiː kɔːld ɪˈmiːdiətli tu əˈpɒlədʒaɪz fɔːr əˈraɪvɪŋ leɪt/', 'Anh ấy gọi ngay lập tức để xin lỗi vì đã đến muộn.'],
    ['x_excited', 'excited', '/ɪkˈsaɪtɪd/', 'tính từ', 'hào hứng, phấn khích', 'The students are excited about their weekend trip.', '/ðə ˈstuːdənts ɑːr ɪkˈsaɪtɪd əˈbaʊt ðɛr ˈwiːkɛnd trɪp/', 'Các học sinh rất hào hứng về chuyến đi cuối tuần.'],
    ['x_hug', 'hug', '/hʌɡ/', 'danh từ/động từ', 'cái ôm, ôm chầm', 'She gave her younger brother a big hug at the station.', '/ʃiː ɡeɪv hɜːr ˈjʌŋɡər ˈbrʌðər ə bɪɡ hʌɡ æt ðə ˈsteɪʃən/', 'Cô ấy ôm chầm lấy em trai tại nhà ga.'],
  ], 'daily'),
  ...buildPackLexicon('en', 3, 'beginner', [
    ['x_honest', 'honest', '/ˈɒnɪst/', 'tính từ', 'trung thực, thành thật', 'Thank you for giving me an honest opinion today.', '/θæŋk juː fɔːr ˈɡɪvɪŋ miː æn ˈɒnɪst əˈpɪnjən təˈdeɪ/', 'Cảm ơn bạn đã cho tôi một ý kiến thật lòng hôm nay.'],
    ['x_lonely', 'lonely', '/ˈloʊnli/', 'tính từ', 'cô đơn, lẻ loi', 'Calling old friends helps whenever you feel lonely.', '/ˈkɔːlɪŋ oʊld frɛndz hɛlps wɛnˈɛvər juː fiːl ˈloʊnli/', 'Gọi điện cho bạn cũ giúp ích mỗi khi bạn cảm thấy cô đơn.'],
  ], 'daily'),
  ...buildPackLexicon('en', 4, 'intermediate', [
    ['x_encourage', 'encourage', '/ɪnˈkɜːrɪdʒ/', 'động từ', 'khích lệ, động viên', 'Good teammates encourage each other after a tough loss.', '/ɡʊd ˈtiːmmeɪts ɪnˈkɜːrɪdʒ iːtʃ ˈʌðər ˈæftər ə tʌf lɒs/', 'Đồng đội tốt luôn động viên nhau sau một trận thua khó khăn.'],
    ['x_embarrassed', 'embarrassed', '/ɪmˈbærəst/', 'tính từ', 'ngượng ngùng, xấu hổ', 'I felt embarrassed when I forgot my classmate’s name.', '/aɪ fɛlt ɪmˈbærəst wɛn aɪ fərˈɡɒt maɪ ˈklæsmeɪts neɪm/', 'Tôi thấy ngượng khi lỡ quên tên bạn cùng lớp.'],
  ], 'daily'),
  ...buildPackLexicon('en', 5, 'intermediate', [
    ['x_misunderstanding', 'misunderstanding', '/ˌmɪsʌndərˈstændɪŋ/', 'danh từ', 'sự hiểu lầm', 'A calm conversation cleared up the whole misunderstanding.', '/ə kɑːm ˌkɒnvərˈseɪʃən klɪrd ʌp ðə hoʊl ˌmɪsʌndərˈstændɪŋ/', 'Một cuộc trò chuyện bình tĩnh đã hóa giải toàn bộ hiểu lầm.'],
    ['x_reliable', 'reliable', '/rɪˈlaɪəbəl/', 'tính từ', 'đáng tin cậy', 'Everyone trusts Minh because he is calm and reliable.', '/ˈɛvriwʌn trʌsts mɪn bɪˈkɒz hiː ɪz kɑːm ænd rɪˈlaɪəbəl/', 'Ai cũng tin tưởng Minh vì cậu ấy điềm tĩnh và đáng tin cậy.'],
  ], 'daily'),
  ...buildPackLexicon('en', 6, 'intermediate', [
    ['x_compromise', 'compromise', '/ˈkɒmprəmaɪz/', 'danh từ/động từ', 'thỏa hiệp, nhượng bộ', 'Both sides reached a fair compromise before dinner.', '/boʊθ saɪdz riːtʃt ə fɛr ˈkɒmprəmaɪz bɪˈfɔːr ˈdɪnər/', 'Cả hai bên đã đạt được thỏa hiệp công bằng trước bữa tối.'],
    ['x_appreciate', 'appreciate', '/əˈpriːʃieɪt/', 'động từ', 'trân trọng, cảm kích', 'I truly appreciate all the time you spent helping me.', '/aɪ ˈtruːli əˈpriːʃieɪt ɔːl ðə taɪm juː spɛnt ˈhɛlpɪŋ miː/', 'Tôi thật sự cảm kích khoảng thời gian bạn dành ra giúp tôi.'],
  ], 'daily'),
  ...buildPackLexicon('en', 7, 'intermediate', [
    ['x_sympathy', 'sympathy', '/ˈsɪmpəθi/', 'danh từ', 'sự đồng cảm, cảm thông', 'She listened with deep sympathy while her friend cried.', '/ʃiː ˈlɪsənd wɪð diːp ˈsɪmpəθi waɪl hɜːr frɛnd kraɪd/', 'Cô ấy lắng nghe với sự cảm thông sâu sắc khi bạn mình khóc.'],
    ['x_trustworthy', 'trustworthy', '/ˈtrʌstwɜːrði/', 'tính từ', 'đáng tin, giữ chữ tín', 'Choose a trustworthy partner before sharing your secret.', '/tʃuːz ə ˈtrʌstwɜːrði ˈpɑːrtnər bɪˈfɔːr ˈʃɛrɪŋ jʊr ˈsiːkrət/', 'Hãy chọn người bạn đáng tin trước khi chia sẻ bí mật.'],
  ], 'daily'),
  ...buildPackLexicon('en', 8, 'advanced', [
    ['x_empathy', 'empathy', '/ˈɛmpəθi/', 'danh từ', 'sự thấu cảm', 'True empathy lets us see the world through another’s eyes.', '/truː ˈɛmpəθi lɛts ʌs siː ðə wɜːrld θruː əˈnʌðərz aɪz/', 'Sự thấu cảm thực sự giúp ta nhìn thế giới qua đôi mắt người khác.'],
    ['x_reconcile', 'reconcile', '/ˈrɛkənsaɪl/', 'động từ', 'hòa giải, làm lành', 'After years apart, the two rivals decided to reconcile.', '/ˈæftər jɪrz əˈpɑːrt, ðə tuː ˈraɪvəlz dɪˈsaɪdɪd tə ˈrɛkənsaɪl/', 'Sau nhiều năm xa cách, hai đối thủ quyết định làm lành với nhau.'],
  ], 'daily'),
  ...buildPackLexicon('en', 9, 'advanced', [
    ['x_eloquent', 'eloquent', '/ˈɛləkwənt/', 'tính từ', 'hùng hồn, ăn nói lưu loát', 'Her eloquent speech moved everyone in the auditorium.', '/hɜːr ˈɛləkwənt spiːtʃ muːvd ˈɛvriwʌn ɪn ði ˌɔːdɪˈtɔːriəm/', 'Bài phát biểu hùng hồn của cô ấy làm lay động cả hội trường.'],
  ], 'daily'),
  ...buildPackLexicon('en', 10, 'advanced', [
    ['x_camaraderie', 'camaraderie', '/ˌkæməˈrɑːdəri/', 'danh từ', 'tình đồng đội gắn bó', 'Shared challenges built lasting camaraderie among the crew.', '/ʃɛrd ˈtʃælɪndʒɪz bɪlt ˈlæstɪŋ ˌkæməˈrɑːdəri əˈmʌŋ ðə kruː/', 'Những thử thách chung đã xây đắp tình đồng đội bền chặt cho cả nhóm.'],
  ], 'daily'),

  // ==================== 2. DU LỊCH, ĂN UỐNG, MUA SẮM & THÀNH PHỐ (travel — 20 từ) ====================
  ...buildPackLexicon('en', 1, 'beginner', [
    ['x_passport', 'passport', '/ˈpæspɔːrt/', 'danh từ', 'hộ chiếu', 'Keep your passport safe inside your front pocket.', '/kiːp jʊr ˈpæspɔːrt seɪf ɪnˈsaɪd jʊr frʌnt ˈpɒkɪt/', 'Hãy giữ hộ chiếu cẩn thận trong túi áo trước.'],
    ['x_airport', 'airport', '/ˈɛrpɔːrt/', 'danh từ', 'sân bay', 'We should arrive at the airport two hours early.', '/wiː ʃʊd əˈraɪv æt ði ˈɛrpɔːrt tuː ˈaʊərz ˈɜːrli/', 'Chúng ta nên có mặt ở sân bay sớm hai tiếng.'],
    ['x_ticket', 'ticket', '/ˈtɪkɪt/', 'danh từ', 'tấm vé', 'Show your train ticket to the conductor at platform nine.', '/ʃoʊ jʊr treɪn ˈtɪkɪt tə ðə kənˈdʌktər æt ˈplætfɔːrm naɪn/', 'Hãy xuất trình vé tàu cho người soát vé ở sân ga số chín.'],
  ], 'travel'),
  ...buildPackLexicon('en', 2, 'beginner', [
    ['x_hotel', 'hotel', '/hoʊˈtɛl/', 'danh từ', 'khách sạn', 'Our seaside hotel has a balcony facing the bay.', '/aʊər ˈsiːsaɪd hoʊˈtɛl hæz ə ˈbælkəni ˈfeɪsɪŋ ðə beɪ/', 'Khách sạn ven biển của chúng tôi có ban công hướng ra vịnh.'],
    ['x_menu', 'menu', '/ˈmɛnjuː/', 'danh từ', 'thực đơn', 'Could you bring us the dinner menu and two glasses of water?', '/kʊd juː brɪŋ ʌs ðə ˈdɪnər ˈmɛnjuː ænd tuː ˈɡlæsɪz əv ˈwɔːtər/', 'Bạn mang giúp chúng tôi thực đơn bữa tối và hai ly nước nhé?'],
    ['x_receipt', 'receipt', '/rɪˈsiːt/', 'danh từ', 'hóa đơn thanh toán', 'Please keep the receipt in case you want to exchange the jacket.', '/pliːz kiːp ðə rɪˈsiːt ɪn keɪs juː wɒnt tu ɪksˈtʃeɪndʒ ðə ˈdʒækɪt/', 'Vui lòng giữ lại hóa đơn phòng khi bạn muốn đổi áo khoác.'],
  ], 'travel'),
  ...buildPackLexicon('en', 3, 'beginner', [
    ['x_subway', 'subway', '/ˈsʌbweɪ/', 'danh từ', 'tàu điện ngầm', 'Taking the subway is faster than driving during rush hour.', '/ˈteɪkɪŋ ðə ˈsʌbweɪ ɪz ˈfæstər ðæn ˈdraɪvɪŋ ˈdjʊrɪŋ rʌʃ ˈaʊər/', 'Đi tàu điện ngầm nhanh hơn lái xe vào giờ cao điểm.'],
    ['x_map', 'map', '/mæp/', 'danh từ', 'bản đồ', 'Check the city map before turning left at the square.', '/tʃɛk ðə ˈsɪti mæp bɪˈfɔːr ˈtɜːrnɪŋ lɛft æt ðə skwɛr/', 'Hãy xem bản đồ thành phố trước khi rẽ trái ở quảng trường.'],
  ], 'travel'),
  ...buildPackLexicon('en', 4, 'intermediate', [
    ['x_luggage', 'luggage', '/ˈlʌɡɪdʒ/', 'danh từ', 'hành lý', 'Travelers collected their luggage from carousel three.', '/ˈtrævələrz kəˈlɛktɪd ðɛr ˈlʌɡɪdʒ frɒm ˌkærəˈsɛl θriː/', 'Hành khách lấy hành lý của mình ở băng chuyền số ba.'],
    ['x_reservation', 'reservation', '/ˌrɛzərˈveɪʃən/', 'danh từ', 'sự đặt chỗ trước', 'I made a dinner reservation for four people at seven.', '/aɪ meɪd ə ˈdɪnər ˌrɛzərˈveɪʃən fɔːr fɔːr ˈpiːpəl æt ˈsɛvən/', 'Tôi đã đặt bàn ăn tối cho bốn người lúc bảy giờ.'],
  ], 'travel'),
  ...buildPackLexicon('en', 5, 'intermediate', [
    ['x_departure', 'departure', '/dɪˈpɑːrtʃər/', 'danh từ', 'giờ khởi hành', 'The departure board shows our flight is boarding at gate twelve.', '/ðə dɪˈpɑːrtʃər bɔːrd ʃoʊz aʊər flaɪt ɪz ˈbɔːrdɪŋ æt ɡeɪt twɛlv/', 'Bảng khởi hành báo chuyến bay của chúng ta đang lên máy bay ở cổng 12.'],
    ['x_souvenir', 'souvenir', '/ˌsuːvəˈnɪr/', 'danh từ', 'quà lưu niệm', 'She bought a handmade lantern as a souvenir from Hoi An.', '/ʃiː bɔːt ə ˈhændmeɪd ˈlæntərn æz ə ˌsuːvəˈnɪr frɒm hɔɪ ɑːn/', 'Cô ấy mua một chiếc đèn lồng thủ công làm quà lưu niệm từ Hội An.'],
  ], 'travel'),
  ...buildPackLexicon('en', 6, 'intermediate', [
    ['x_itinerary', 'itinerary', '/aɪˈtɪnəˌrɛri/', 'danh từ', 'lịch trình du lịch', 'Our five-day itinerary covers museums, beaches, and night markets.', '/aʊər faɪv deɪ aɪˈtɪnəˌrɛri ˈkʌvərz mjuːˈziːəmz, ˈbiːtʃɪz, ænd naɪt ˈmɑːrkɪts/', 'Lịch trình năm ngày của chúng tôi gồm bảo tàng, bãi biển và chợ đêm.'],
    ['x_discount', 'discount', '/ˈdɪskaʊnt/', 'danh từ', 'mức giảm giá', 'Students receive a twenty percent discount at this bookstore.', '/ˈstuːdənts rɪˈsiːv ə ˈtwɛnti pərˈsɛnt ˈdɪskaʊnt æt ðɪs ˈbʊkstɔːr/', 'Học sinh được giảm giá hai mươi phần trăm tại hiệu sách này.'],
  ], 'travel'),
  ...buildPackLexicon('en', 7, 'intermediate', [
    ['x_intersection', 'intersection', '/ˌɪntərˈsɛkʃən/', 'danh từ', 'ngã tư, giao lộ', 'Turn right at the second intersection past the clock tower.', '/tɜːrn raɪt æt ðə ˈsɛkənd ˌɪntərˈsɛkʃən pæst ðə klɒk ˈtaʊər/', 'Hãy rẽ phải ở ngã tư thứ hai sau tháp đồng hồ.'],
    ['x_currency', 'currency', '/ˈkɜːrənsi/', 'danh từ', 'tiền tệ, ngoại tệ', 'You can exchange foreign currency at the bank counter downtown.', '/juː kæn ɪksˈtʃeɪndʒ ˈfɒrən ˈkɜːrənsi æt ðə bæŋk ˈkaʊntər ˌdaʊnˈtaʊn/', 'Bạn có thể đổi ngoại tệ tại quầy ngân hàng ở trung tâm thành phố.'],
  ], 'travel'),
  ...buildPackLexicon('en', 8, 'advanced', [
    ['x_cosmopolitan', 'cosmopolitan', '/ˌkɒzməˈpɒlɪtən/', 'tính từ', 'đa văn hóa, mang tầm quốc tế', 'London is a vibrant cosmopolitan city full of historic cafés.', '/ˈlʌndən ɪz ə ˈvaɪbrənt ˌkɒzməˈpɒlɪtən ˈsɪti fʊl əv hɪˈstɒrɪk kæˈfeɪz/', 'Luân Đôn là thành phố quốc tế sôi động với nhiều quán cà phê cổ kính.'],
    ['x_hospitality', 'hospitality', '/ˌhɒspɪˈtæləti/', 'danh từ', 'lòng hiếu khách', 'The travelers never forgot the warm hospitality of the island.', '/ðə ˈtrævələrz ˈnɛvər fərˈɡɒt ðə wɔːrm ˌhɒspɪˈtæləti əv ði ˈaɪlənd/', 'Du khách không bao giờ quên lòng hiếu khách nồng hậu của hòn đảo.'],
  ], 'travel'),
  ...buildPackLexicon('en', 9, 'advanced', [
    ['x_excursion', 'excursion', '/ɪkˈskɜːrʒən/', 'danh từ', 'chuyến tham quan ngắn ngày', 'We booked a boat excursion along the emerald limestone cliffs.', '/wiː bʊkt ə boʊt ɪkˈskɜːrʒən əˈlɒŋ ði ˈɛmərəld ˈlaɪmstoʊn klɪfs/', 'Chúng tôi đặt một chuyến du ngoạn bằng thuyền dọc vách đá vôi xanh ngọc.'],
  ], 'travel'),
  ...buildPackLexicon('en', 10, 'advanced', [
    ['x_wanderlust', 'wanderlust', '/ˈwɒndərlʌst/', 'danh từ', 'niềm đam mê xê dịch, khát khao khám phá', 'Reading travel journals sparked her lifelong wanderlust.', '/ˈriːdɪŋ ˈtrævəl ˈdʒɜːrnəlz spɑːrkt hɜːr ˈlaɪflɒŋ ˈwɒndərlʌst/', 'Đọc nhật ký du lịch đã khơi dậy niềm đam mê xê dịch suốt đời của cô.'],
  ], 'travel'),

  // ==================== 3. HỌC TẬP, CÔNG VIỆC & CÔNG NGHỆ (study_tech — 20 từ) ====================
  ...buildPackLexicon('en', 1, 'beginner', [
    ['x_notebook', 'notebook', '/ˈnoʊtbʊk/', 'danh từ', 'quyển vở ghi chép', 'Write every new vocabulary word in your pocket notebook.', '/raɪt ˈɛvri nuː voʊˈkæbjʊˌlɛri wɜːrd ɪn jʊr ˈpɒkɪt ˈnoʊtbʊk/', 'Hãy ghi từng từ vựng mới vào quyển sổ tay bỏ túi.'],
    ['x_library', 'library', '/ˈlaɪbrɛri/', 'danh từ', 'thư viện', 'Students often study quietly in the main library after class.', '/ˈstuːdənts ˈɒfən ˈstʌdi ˈkwaɪətli ɪn ðə meɪn ˈlaɪbrɛri ˈæftər klæs/', 'Học sinh thường tự học yên tĩnh trong thư viện chính sau giờ học.'],
    ['x_message', 'message', '/ˈmɛsɪdʒ/', 'danh từ', 'tin nhắn', 'Send me a quick message as soon as you reach home.', '/sɛnd miː ə kwɪk ˈmɛsɪdʒ æz suːn æz juː riːtʃ hoʊm/', 'Nhắn cho tôi một tin ngắn ngay khi bạn về đến nhà nhé.'],
  ], 'study_tech'),
  ...buildPackLexicon('en', 2, 'beginner', [
    ['x_keyboard', 'keyboard', '/ˈkiːbɔːrd/', 'danh từ', 'bàn phím', 'She types quickly on her compact wireless keyboard.', '/ʃiː taɪps ˈkwɪkli ɒn hɜːr ˈkɒmpækt ˈwaɪərləs ˈkiːbɔːrd/', 'Cô ấy gõ rất nhanh trên chiếc bàn phím không dây nhỏ gọn.'],
    ['x_password', 'password', '/ˈpæswɜːrd/', 'danh từ', 'mật khẩu', 'Never share your account password with strangers online.', '/ˈnɛvər ʃɛr jʊr əˈkaʊnt ˈpæswɜːrd wɪð ˈstreɪndʒərz ˌɒnˈlaɪn/', 'Đừng bao giờ chia sẻ mật khẩu tài khoản với người lạ trên mạng.'],
  ], 'study_tech'),
  ...buildPackLexicon('en', 3, 'beginner', [
    ['x_homework', 'homework', '/ˈhoʊmwɜːrk/', 'danh từ', 'bài tập về nhà', 'Finish your math homework before playing video games.', '/ˈfɪnɪʃ jʊr mæθ ˈhoʊmwɜːrk bɪˈfɔːr ˈpleɪɪŋ ˈvɪdioʊ ɡeɪmz/', 'Hãy làm xong bài tập toán trước khi chơi điện tử.'],
    ['x_meeting', 'meeting', '/ˈmiːtɪŋ/', 'danh từ', 'cuộc họp', 'Our morning team meeting starts promptly at nine o’clock.', '/aʊər ˈmɔːrnɪŋ tiːm ˈmiːtɪŋ stɑːrts ˈprɒmptli æt naɪn əˈklɒk/', 'Cuộc họp nhóm buổi sáng của chúng ta bắt đầu đúng chín giờ.'],
  ], 'study_tech'),
  ...buildPackLexicon('en', 4, 'intermediate', [
    ['x_deadline', 'deadline', '/ˈdɛdlaɪn/', 'danh từ', 'hạn chót', 'The design team submitted the report well before the deadline.', '/ðə dɪˈzaɪn tiːm səbˈmɪtɪd ðə rɪˈpɔːrt wɛl bɪˈfɔːr ðə ˈdɛdlaɪn/', 'Nhóm thiết kế đã nộp báo cáo trước hạn chót rất sớm.'],
    ['x_colleague', 'colleague', '/ˈkɒliːɡ/', 'danh từ', 'đồng nghiệp', 'My colleague showed me a faster shortcut in the spreadsheet.', '/maɪ ˈkɒliːɡ ʃoʊd miː ə ˈfæstər ˈʃɔːrtkʌt ɪn ðə ˈsprɛdʃiːt/', 'Đồng nghiệp chỉ cho tôi một phím tắt nhanh hơn trong bảng tính.'],
  ], 'study_tech'),
  ...buildPackLexicon('en', 5, 'intermediate', [
    ['x_scholarship', 'scholarship', '/ˈskɒlərʃɪp/', 'danh từ', 'học bổng', 'Her outstanding essay earned a full university scholarship.', '/hɜːr aʊtˈstændɪŋ ˈɛseɪ ɜːrnd ə fʊl ˌjuːnɪˈvɜːrsəti ˈskɒlərʃɪp/', 'Bài luận xuất sắc của cô đã mang về suất học bổng đại học toàn phần.'],
    ['x_notification', 'notification', '/ˌnoʊtɪfɪˈkeɪʃən/', 'danh từ', 'thông báo (điện thoại/ứng dụng)', 'Turn off phone notifications while preparing for exams.', '/tɜːrn ɒf foʊn ˌnoʊtɪfɪˈkeɪʃənz waɪl prɪˈpɛrɪŋ fɔːr ɪɡˈzæmz/', 'Hãy tắt thông báo điện thoại trong lúc ôn thi.'],
  ], 'study_tech'),
  ...buildPackLexicon('en', 6, 'intermediate', [
    ['x_presentation', 'presentation', '/ˌprɛzənˈteɪʃən/', 'danh từ', 'bài thuyết trình', 'He practiced his slide presentation twice before the seminar.', '/hiː ˈpræktɪst hɪz slaɪd ˌprɛzənˈteɪʃən twaɪs bɪˈfɔːr ðə ˈsɛmɪnɑːr/', 'Anh ấy tập dượt bài thuyết trình hai lần trước buổi hội thảo.'],
    ['x_feedback', 'feedback', '/ˈfiːdbæk/', 'danh từ', 'phản hồi, góp ý', 'Constructive feedback helps writers polish every chapter.', '/kənˈstrʌktɪv ˈfiːdbæk hɛlps ˈraɪtərz ˈpɒlɪʃ ˈɛvri ˈtʃæptər/', 'Góp ý mang tính xây dựng giúp người viết trau chuốt từng chương.'],
  ], 'study_tech'),
  ...buildPackLexicon('en', 7, 'intermediate', [
    ['x_algorithm', 'algorithm', '/ˈælɡəˌrɪðəm/', 'danh từ', 'thuật toán', 'The search algorithm ranks accurate answers at the top.', '/ðə sɜːrtʃ ˈælɡəˌrɪðəm ræŋks ˈækjərət ˈænsərz æt ðə tɒp/', 'Thuật toán tìm kiếm xếp các kết quả chính xác lên đầu trang.'],
    ['x_application', 'application', '/ˌæplɪˈkeɪʃən/', 'danh từ', 'ứng dụng, đơn đăng ký', 'This language application tracks your daily review streak.', '/ðɪs ˈlæŋɡwɪdʒ ˌæplɪˈkeɪʃən træks jʊr ˈdeɪli rɪˈvjuː striːk/', 'Ứng dụng học ngoại ngữ này theo dõi chuỗi ôn tập mỗi ngày của bạn.'],
  ], 'study_tech'),
  ...buildPackLexicon('en', 8, 'advanced', [
    ['x_innovation', 'innovation', '/ˌɪnəˈveɪʃən/', 'danh từ', 'sự đổi mới, sáng tạo đột phá', 'Clean energy innovation transforms modern urban life.', '/kliːn ˈɛnərdʒi ˌɪnəˈveɪʃən trænsˈfɔːrmz ˈmɒdərn ˈɜːrbən laɪf/', 'Đổi mới năng lượng sạch làm thay đổi đời sống đô thị hiện đại.'],
    ['x_encryption', 'encryption', '/ɪnˈkrɪpʃən/', 'danh từ', 'sự mã hóa bảo mật', 'Strong encryption protects private messages from hackers.', '/strɒŋ ɪnˈkrɪpʃən prəˈtɛkts ˈpraɪvət ˈmɛsɪdʒɪz frɒm ˈhækərz/', 'Mã hóa mạnh bảo vệ tin nhắn riêng tư khỏi tin tặc.'],
  ], 'study_tech'),
  ...buildPackLexicon('en', 9, 'advanced', [
    ['x_proficiency', 'proficiency', '/prəˈfɪʃənsi/', 'danh từ', 'sự thành thạo, trình độ thông thạo', 'Consistent speaking practice builds true language proficiency.', '/kənˈsɪstənt ˈspiːkɪŋ ˈpræktɪs bɪldz truː ˈlæŋɡwɪdʒ prəˈfɪʃənsi/', 'Luyện nói đều đặn xây dựng năng lực ngoại ngữ thành thạo thực thụ.'],
    ['x_automation', 'automation', '/ˌɔːtəˈmeɪʃən/', 'danh từ', 'tự động hóa', 'Smart automation saves engineers hours of repetitive testing.', '/smɑːrt ˌɔːtəˈmeɪʃən seɪvz ˌɛndʒɪˈnɪrz ˈaʊərz əv rɪˈpɛtətɪv ˈtɛstɪŋ/', 'Tự động hóa thông minh giúp kỹ sư tiết kiệm nhiều giờ kiểm thử lặp lại.'],
  ], 'study_tech'),
  ...buildPackLexicon('en', 10, 'advanced', [
    ['x_paradigm', 'paradigm', '/ˈpærədaɪm/', 'danh từ', 'mô hình chuẩn, hệ tư duy mới', 'Artificial intelligence ushered in a new computing paradigm.', '/ˌɑːrtɪˈfɪʃəl ɪnˈtɛlɪdʒəns ˈʌʃərd ɪn ə nuː kəmˈpjuːtɪŋ ˈpærədaɪm/', 'Trí tuệ nhân tạo đã mở ra một mô hình điện toán hoàn toàn mới.'],
  ], 'study_tech'),

  // ==================== 4. SỨC KHỎE, THỂ THAO, ÂM NHẠC & GIẢI TRÍ (health_hobby — 20 từ) ====================
  ...buildPackLexicon('en', 1, 'beginner', [
    ['x_hospital', 'hospital', '/ˈhɒspɪtəl/', 'danh từ', 'bệnh viện', 'The central hospital stays open twenty-four hours a day.', '/ðə ˈsɛntrəl ˈhɒspɪtəl steɪz ˈoʊpən ˈtwɛnti fɔːr ˈaʊərz ə deɪ/', 'Bệnh viện trung tâm mở cửa suốt hai mươi bốn giờ mỗi ngày.'],
    ['x_fever', 'fever', '/ˈfiːvər/', 'danh từ', 'cơn sốt', 'Drink plenty of water and rest if you have a fever.', '/drɪŋk ˈplɛnti əv ˈwɔːtər ænd rɛst ɪf juː hæv ə ˈfiːvər/', 'Hãy uống nhiều nước và nghỉ ngơi nếu bạn bị sốt.'],
    ['x_guitar', 'guitar', '/ɡɪˈtɑːr/', 'danh từ', 'đàn ghi-ta', 'Nam plays acoustic guitar by the campfire every summer.', '/næm pleɪz əˈkuːstɪk ɡɪˈtɑːr baɪ ðə ˈkæmpfaɪər ˈɛvri ˈsʌmər/', 'Nam chơi đàn ghi-ta mộc bên lửa trại mỗi mùa hè.'],
  ], 'health_hobby'),
  ...buildPackLexicon('en', 2, 'beginner', [
    ['x_medicine', 'medicine', '/ˈmɛdɪsən/', 'danh từ', 'thuốc chữa bệnh', 'Take this medicine after meals as the doctor advised.', '/teɪk ðɪs ˈmɛdɪsən ˈæftər miːlz æz ðə ˈdɒktər ədˈvaɪzd/', 'Hãy uống thuốc này sau bữa ăn theo lời khuyên của bác sĩ.'],
    ['x_concert', 'concert', '/ˈkɒnsərt/', 'danh từ', 'buổi hòa nhạc', 'Tickets for the symphony concert sold out within ten minutes.', '/ˈtɪkɪts fɔːr ðə ˈsɪmfəni ˈkɒnsərt soʊld aʊt wɪˈðɪn tɛn ˈmɪnɪts/', 'Vé cho buổi hòa nhạc giao hưởng đã bán hết trong mười phút.'],
  ], 'health_hobby'),
  ...buildPackLexicon('en', 3, 'beginner', [
    ['x_swimming', 'swimming', '/ˈswɪmɪŋ/', 'danh từ', 'môn bơi lội', 'Morning swimming keeps my back strong and relaxed.', '/ˈmɔːrnɪŋ ˈswɪmɪŋ kiːps maɪ bæk strɒŋ ænd rɪˈlækst/', 'Bơi lội buổi sáng giúp lưng tôi khỏe khoắn và thư giãn.'],
    ['x_camera', 'camera', '/ˈkæmərə/', 'danh từ', 'máy ảnh', 'She brought a vintage film camera to capture street life.', '/ʃiː brɔːt ə ˈvɪntɪdʒ fɪlm ˈkæmərə tə ˈkæptʃər striːt laɪf/', 'Cô ấy mang theo chiếc máy ảnh phim cổ để ghi lại nhịp sống đường phố.'],
  ], 'health_hobby'),
  ...buildPackLexicon('en', 4, 'intermediate', [
    ['x_nutrition', 'nutrition', '/njuːˈtrɪʃən/', 'danh từ', 'dinh dưỡng', 'Balanced nutrition and good sleep boost daily focus.', '/ˈbælənst njuːˈtrɪʃən ænd ɡʊd sliːp buːst ˈdeɪli ˈfoʊkəs/', 'Dinh dưỡng cân bằng và giấc ngủ ngon giúp tăng độ tập trung mỗi ngày.'],
    ['x_melody', 'melody', '/ˈmɛlədi/', 'danh từ', 'giai điệu', 'That gentle piano melody has been stuck in my head all day.', '/ðæt ˈdʒɛntəl piˈænoʊ ˈmɛlədi hæz biːn stʌk ɪn maɪ hɛd ɔːl deɪ/', 'Giai điệu piano dịu dàng đó cứ văng vẳng trong đầu tôi cả ngày.'],
  ], 'health_hobby'),
  ...buildPackLexicon('en', 5, 'intermediate', [
    ['x_stamina', 'stamina', '/ˈstæmɪnə/', 'danh từ', 'sức bền, thể lực', 'Long distance jogging gradually builds lung stamina.', '/lɒŋ ˈdɪstəns ˈdʒɒɡɪŋ ˈɡrædʒuəli bɪldz lʌŋ ˈstæmɪnə/', 'Chạy bộ đường dài giúp xây dựng sức bền phổi dần dần.'],
    ['x_director', 'director', '/dəˈrɛktər/', 'danh từ', 'đạo diễn, giám đốc', 'The film director won an award for best cinematography.', '/ðə fɪlm dəˈrɛktər wʌn æn əˈwɔːrd fɔːr bɛst ˌsɪnəməˈtɒɡrəfi/', 'Vị đạo diễn phim đã giành giải quay phim xuất sắc nhất.'],
  ], 'health_hobby'),
  ...buildPackLexicon('en', 6, 'intermediate', [
    ['x_prescription', 'prescription', '/prɪˈskrɪpʃən/', 'danh từ', 'đơn thuốc của bác sĩ', 'Bring your doctor’s prescription to the corner pharmacy.', '/brɪŋ jʊr ˈdɒktərz prɪˈskrɪpʃən tə ðə ˈkɔːrnər ˈfɑːrməsi/', 'Hãy mang đơn thuốc của bác sĩ tới hiệu thuốc ở góc phố.'],
    ['x_exhibition', 'exhibition', '/ˌɛksɪˈbɪʃən/', 'danh từ', 'buổi triển lãm', 'The modern art exhibition opens this Saturday morning.', '/ðə ˈmɒdərn ɑːrt ˌɛksɪˈbɪʃən ˈoʊpənz ðɪs ˈsætərdeɪ ˈmɔːrnɪŋ/', 'Triển lãm nghệ thuật đương đại khai mạc vào sáng thứ Bảy này.'],
  ], 'health_hobby'),
  ...buildPackLexicon('en', 7, 'intermediate', [
    ['x_marathon', 'marathon', '/ˈmærəθɒn/', 'danh từ', 'cuộc chạy ma-ra-tông', 'She trained for six months to finish her first city marathon.', '/ʃiː treɪnd fɔːr sɪks mʌnθs tə ˈfɪnɪʃ hɜːr fɜːrst ˈsɪti ˈmærəθɒn/', 'Cô ấy tập luyện suốt sáu tháng để hoàn thành giải ma-ra-tông đầu tiên.'],
    ['x_meditation', 'meditation', '/ˌmɛdɪˈteɪʃən/', 'danh từ', 'sự thiền định, tĩnh tâm', 'Ten minutes of morning meditation calms a busy mind.', '/tɛn ˈmɪnɪts əv ˈmɔːrnɪŋ ˌmɛdɪˈteɪʃən kɑːmz ə ˈbɪzi maɪnd/', 'Mười phút thiền buổi sáng giúp xoa dịu tâm trí bận rộn.'],
  ], 'health_hobby'),
  ...buildPackLexicon('en', 8, 'advanced', [
    ['x_immunity', 'immunity', '/ɪˈmjuːnəti/', 'danh từ', 'khả năng miễn dịch', 'Regular exercise strengthens the body’s natural immunity.', '/ˈrɛɡjʊlər ˈɛksərsaɪz ˈstrɛŋθənz ðə ˈbɒdiz ˈnætʃərəl ɪˈmjuːnəti/', 'Tập thể dục đều đặn giúp củng cố hệ miễn dịch tự nhiên của cơ thể.'],
    ['x_masterpiece', 'masterpiece', '/ˈmæstərpiːs/', 'danh từ', 'kiệt tác nghệ thuật', 'Critics hailed the animated film as a timeless masterpiece.', '/ˈkrɪtɪks heɪld ði ˈænɪmeɪtɪd fɪlm æz ə ˈtaɪmləs ˈmæstərpiːs/', 'Giới phê bình ca ngợi bộ phim hoạt hình là một kiệt tác vượt thời gian.'],
  ], 'health_hobby'),
  ...buildPackLexicon('en', 9, 'advanced', [
    ['x_choreography', 'choreography', '/ˌkɒriˈɒɡrəfi/', 'danh từ', 'biên đạo múa, vũ đạo', 'The stage show dazzled fans with seamless choreography.', '/ðə steɪdʒ ʃoʊ ˈdæzəld fænz wɪð ˈsiːmləs ˌkɒriˈɒɡrəfi/', 'Màn trình diễn sân khấu làm khán giả choáng ngợp với vũ đạo mượt mà.'],
    ['x_rehabilitation', 'rehabilitation', '/ˌriːəˌbɪlɪˈteɪʃən/', 'danh từ', 'sự phục hồi chức năng', 'Careful knee rehabilitation allowed the athlete to run again.', '/ˈkɛrfəl niː ˌriːəˌbɪlɪˈteɪʃən əˈlaʊd ði ˈæθliːt tə rʌn əˈɡɛn/', 'Quá trình phục hồi đầu gối cẩn thận giúp vận động viên chạy lại được.'],
  ], 'health_hobby'),
  ...buildPackLexicon('en', 10, 'advanced', [
    ['x_catharsis', 'catharsis', '/kəˈθɑːrsɪs/', 'danh từ', 'sự giải tỏa cảm xúc qua nghệ thuật', 'The dramatic finale offered viewers a deep emotional catharsis.', '/ðə drəˈmætɪk fɪˈnæli ˈɒfərd ˈvjuːərz ə diːp ɪˈmoʊʃənəl kəˈθɑːrsɪs/', 'Hồi kết kịch tính mang lại cho khán giả sự giải tỏa cảm xúc sâu sắc.'],
  ], 'health_hobby'),

  // ==================== 5. THẾ GIỚI HARRY POTTER & PHÉP THUẬT (magic — 20 từ) ====================
  ...buildPackLexicon('en', 1, 'beginner', [
    ['x_wand', 'wand', '/wɒnd/', 'danh từ', 'đũa phép', 'Every young wizard learns that the wand chooses the wizard.', '/ˈɛvri jʌŋ ˈwɪzərd lɜːrnz ðæt ðə wɒnd ˈtʃuːzɪz ðə ˈwɪzərd/', 'Mọi phù thủy nhỏ đều học rằng chính đũa phép sẽ chọn chủ nhân.'],
    ['x_spell', 'spell', '/spɛl/', 'danh từ', 'thần chú, câu bùa', 'Pronounce each syllable clearly before casting a light spell.', '/prəˈnaʊns iːtʃ ˈsɪləbəl ˈklɪrli bɪˈfɔːr ˈkæstɪŋ ə laɪt spɛl/', 'Hãy phát âm rõ từng âm tiết trước khi niệm thần chú phát sáng.'],
  ], 'magic'),
  ...buildPackLexicon('en', 2, 'beginner', [
    ['x_broomstick', 'broomstick', '/ˈbruːmstɪk/', 'danh từ', 'chổi bay phép thuật', 'First-year students practice hovering on a wooden broomstick.', '/fɜːrst jɪr ˈstuːdənts ˈpræktɪs ˈhɒvərɪŋ ɒn ə ˈwʊdən ˈbruːmstɪk/', 'Học sinh năm nhất tập giữ thăng bằng trên chiếc chổi bay gỗ.'],
    ['x_potion', 'potion', '/ˈpoʊʃən/', 'danh từ', 'độc dược, thuốc phép', 'Stir the silver potion three times counterclockwise.', '/stɜːr ðə ˈsɪlvər ˈpoʊʃən θriː taɪmz ˌkaʊntərˈklɒkwaɪz/', 'Hãy khuấy bình độc dược ánh bạc ba vòng ngược chiều kim đồng hồ.'],
  ], 'magic'),
  ...buildPackLexicon('en', 3, 'beginner', [
    ['x_cloak', 'cloak', '/kloʊk/', 'danh từ', 'áo choàng phép thuật', 'He wrapped the invisibility cloak tightly around his shoulders.', '/hiː ræpt ði ɪnˌvɪzəˈbɪləti kloʊk ˈtaɪtli əˈraʊnd hɪz ˈʃoʊldərz/', 'Cậu ấy khoác chặt chiếc áo choàng tàng hình qua vai.'],
    ['x_castle', 'castle', '/ˈkæsəl/', 'danh từ', 'lâu đài cổ kính', 'Torchlight flickered along the high stone towers of the castle.', '/ˈtɔːrtʃlaɪt ˈflɪkərd əˈlɒŋ ðə haɪ stoʊn ˈtaʊərz əv ðə ˈkæsəl/', 'Ánh đuốc bập bùng dọc những ngọn tháp đá cao của tòa lâu đài.'],
  ], 'magic'),
  ...buildPackLexicon('en', 4, 'intermediate', [
    ['x_patronus', 'patronus', '/pəˈtroʊnəs/', 'danh từ', 'thần hộ mệnh', 'Focus on your happiest memory to summon a shining patronus.', '/ˈfoʊkəs ɒn jʊr ˈhæpiɪst ˈmɛməri tə ˈsʌmən ə ˈʃaɪnɪŋ pəˈtroʊnəs/', 'Hãy tập trung vào ký ức hạnh phúc nhất để triệu hồi thần hộ mệnh rực sáng.'],
    ['x_dormitory', 'dormitory', '/ˈdɔːrmɪtɔːri/', 'danh từ', 'ký túc xá học viện', 'Our house dormitory overlooks the misty northern lake.', '/aʊər haʊs ˈdɔːrmɪtɔːri ˌoʊvərˈlʊks ðə ˈmɪsti ˈnɔːrðərn leɪk/', 'Ký túc xá Nhà chúng tôi nhìn thẳng ra mặt hồ sương phủ phía bắc.'],
  ], 'magic'),
  ...buildPackLexicon('en', 5, 'intermediate', [
    ['x_prophecy', 'prophecy', '/ˈprɒfəsi/', 'danh từ', 'lời tiên tri', 'A glowing crystal orb preserved an ancient prophecy.', '/ə ˈɡloʊɪŋ ˈkrɪstəl ɔːrb prɪˈzɜːrvd æn ˈeɪnʃənt ˈprɒfəsi/', 'Quả cầu pha lê phát sáng lưu giữ một lời tiên tri cổ xưa.'],
    ['x_duel', 'duel', '/ˈdjuːəl/', 'danh từ/động từ', 'trận đấu tay đôi pháp thuật', 'Both captains bowed respectfully before the friendly duel.', '/boʊθ ˈkæptɪnz baʊd rɪˈspɛktfəli bɪˈfɔːr ðə ˈfrɛndli ˈdjuːəl/', 'Cả hai đội trưởng cúi chào lịch thiệp trước trận đấu tay đôi giao hữu.'],
  ], 'magic'),
  ...buildPackLexicon('en', 6, 'intermediate', [
    ['x_alchemy', 'alchemy', '/ˈælkəmi/', 'danh từ', 'thuật giả kim', 'Scholars studied medieval alchemy in the restricted section.', '/ˈskɒlərz ˈstʌdid ˌmɛdiˈiːvəl ˈælkəmi ɪn ðə rɪˈstrɪktɪd ˈsɛkʃən/', 'Các học giả nghiên cứu thuật giả kim thời trung cổ ở khu vực cấm.'],
    ['x_headmaster', 'headmaster', '/ˈhɛdˌmæstər/', 'danh từ', 'hiệu trưởng học viện', 'The wise headmaster welcomed every student at the start-of-term feast.', '/ðə waɪz ˈhɛdˌmæstər ˈwɛlkəmd ˈɛvri ˈstuːdənt æt ðə stɑːrt əv tɜːrm fiːst/', 'Vị hiệu trưởng thông thái chào đón mọi học sinh tại tiệc khai giảng.'],
  ], 'magic'),
  ...buildPackLexicon('en', 7, 'intermediate', [
    ['x_amulet', 'amulet', '/ˈæmjʊlət/', 'danh từ', 'bùa hộ mệnh', 'She wore a silver phoenix amulet for protection on journeys.', '/ʃiː wɔːr ə ˈsɪlvər ˈfiːnɪks ˈæmjʊlət fɔːr prəˈtɛkʃən ɒn ˈdʒɜːrniz/', 'Cô ấy đeo chiếc bùa hộ mệnh phượng hoàng bạc để bình an trên đường xa.'],
    ['x_spellbook', 'spellbook', '/ˈspɛlbʊk/', 'danh từ', 'sách thần chú cổ', 'Handwritten notes filled the margins of the old spellbook.', '/ˈhændˌrɪtən noʊts fɪld ðə ˈmɑːrdʒɪnz əv ði oʊld ˈspɛlbʊk/', 'Những dòng ghi chú viết tay phủ kín lề trang quyển sách thần chú cũ.'],
  ], 'magic'),
  ...buildPackLexicon('en', 8, 'advanced', [
    ['x_transfiguration', 'transfiguration', '/ˌtrænsfɪɡjʊˈreɪʃən/', 'danh từ', 'môn biến hình pháp thuật', 'Precision and concentration are essential in transfiguration class.', '/prɪˈsɪʒən ænd ˌkɒnsənˈtreɪʃən ɑːr ɪˈsɛnʃəl ɪn ˌtrænsfɪɡjʊˈreɪʃən klæs/', 'Sự chuẩn xác và tập trung là cốt lõi trong tiết học Biến hình.'],
    ['x_incantation', 'incantation', '/ˌɪnkænˈteɪʃən/', 'danh từ', 'câu niệm chú cổ ngữ', 'A single mispronounced incantation can turn sparks into smoke.', '/ə ˈsɪŋɡəl ˌmɪsprəˈnaʊnst ˌɪnkænˈteɪʃən kæn tɜːrn spɑːrks ˈɪntu smoʊk/', 'Chỉ một câu niệm chú phát âm sai cũng có thể biến tia lửa thành khói.'],
  ], 'magic'),
  ...buildPackLexicon('en', 9, 'advanced', [
    ['x_levitation', 'levitation', '/ˌlɛvɪˈteɪʃən/', 'danh từ', 'bùa bay lơ lửng', 'Mastering the levitation charm takes a gentle flick of the wrist.', '/ˈmæstərɪŋ ðə ˌlɛvɪˈteɪʃən tʃɑːrm teɪks ə ˈdʒɛntəl flɪk əv ðə rɪst/', 'Thành thạo bùa bay lơ lửng đòi hỏi cú vẩy cổ tay nhẹ nhàng.'],
    ['x_apparate', 'apparate', '/ˈæpəreɪt/', 'động từ', 'độn thổ, dịch chuyển tức thời', 'Wizards must pass a strict license test before they apparate.', '/ˈwɪzərdz mʌst pæs ə strɪkt ˈlaɪsəns tɛst bɪˈfɔːr ðeɪ ˈæpəreɪt/', 'Phù thủy phải vượt qua kỳ thi lấy bằng nghiêm ngặt trước khi độn thổ.'],
  ], 'magic'),
  ...buildPackLexicon('en', 10, 'advanced', [
    ['x_clairvoyance', 'clairvoyance', '/klɛrˈvɔɪəns/', 'danh từ', 'nhãn thông, khả năng tiên tri thấu thị', 'True clairvoyance cannot be forced by reading tea leaves alone.', '/truː klɛrˈvɔɪəns ˈkænɒt biː fɔːrst baɪ ˈriːdɪŋ tiː liːvz əˈloʊn/', 'Khả năng thấu thị thực thụ không thể ép buộc chỉ qua việc xem lá trà.'],
    ['x_sorcery', 'sorcery', '/ˈsɔːrsəri/', 'danh từ', 'pháp thuật cao cấp, ma pháp', 'Ancient chronicles speak of protective sorcery woven into castle walls.', '/ˈeɪnʃənt ˈkrɒnɪkəlz spiːk əv prəˈtɛktɪv ˈsɔːrsəri ˈwoʊvən ˈɪntu ˈkæsəl wɔːlz/', 'Biên niên sử cổ chép về lớp pháp thuật bảo vệ dệt trong tường lâu đài.'],
  ], 'magic'),
];

export const EN_EXPANDED_CURATED: CuratedQuizItem[] = [
  {
    id: 'en_x_daily_dial_1',
    lang: 'en',
    tier: 'beginner',
    levelBand: 2,
    topic: 'daily',
    format: 'dialogue_reply',
    promptVi: 'Bạn thân xin lỗi vì lỡ trễ hẹn uống cà phê — chọn cách đáp lại ấm áp nhất:',
    stemText: 'Friend: "I am so sorry I am late! The bus got stuck in traffic."',
    stemPhonetic: '/aɪ æm soʊ ˈsɒri aɪ æm leɪt! ðə bʌs ɡɒt stʌk ɪn ˈtræfɪk/',
    fullSentence: 'No worries at all, I just ordered our drinks!',
    fullPhonetic: '/noʊ ˈwɜːriz æt ɔːl, aɪ dʒʌst ˈɔːrdərd aʊər drɪŋks/',
    translationVi: 'Không sao đâu, mình cũng vừa mới gọi đồ uống thôi!',
    choices: [
      'No worries at all, I just ordered our drinks!',
      'The airport is two kilometers north.',
      'Please submit your passport at gate four.',
      'My guitar is inside the library.',
    ],
    correctIndex: 0,
    grammarTitleVi: 'Phản hồi lời xin lỗi tự nhiên: No worries at all',
    grammarExplainVi: 'Khi bạn bè xin lỗi vì đến trễ, "No worries at all" (Không sao đâu) là cách đáp lại thân thiện và tự nhiên nhất trong giao tiếp hằng ngày.',
    vocabNotes: [
      { word: 'no worries', phonetic: '/noʊ ˈwɜːriz/', posVi: 'cụm giao tiếp', meaningVi: 'đừng lo, không sao đâu' },
      { word: 'stuck in traffic', phonetic: '/stʌk ɪn ˈtræfɪk/', posVi: 'cụm từ', meaningVi: 'bị kẹt xe' },
    ],
  },
  {
    id: 'en_x_travel_cloze_1',
    lang: 'en',
    tier: 'intermediate',
    levelBand: 4,
    topic: 'travel',
    format: 'grammar_cloze',
    promptVi: 'Chọn từ đúng để hỏi đường tới ga tàu điện ngầm:',
    stemText: 'Excuse me, could you tell me ____ the nearest subway station is?',
    stemPhonetic: '/ɪkˈskjuːz miː, kʊd juː tɛl miː ____ ðə ˈnɪrɪst ˈsʌbweɪ ˈsteɪʃən ɪz/',
    fullSentence: 'Excuse me, could you tell me where the nearest subway station is?',
    fullPhonetic: '/ɪkˈskjuːz miː, kʊd juː tɛl miː wɛr ðə ˈnɪrɪst ˈsʌbweɪ ˈsteɪʃən ɪz/',
    translationVi: 'Xin lỗi, bạn có thể chỉ giúp tôi ga tàu điện ngầm gần nhất ở đâu không?',
    choices: ['where', 'when', 'whose', 'whom'],
    choicePhonetics: ['/wɛr/', '/wɛn/', '/huːz/', '/huːm/'],
    correctIndex: 0,
    grammarTitleVi: 'Câu hỏi gián tiếp lịch sự: Could you tell me + where + S + V?',
    grammarExplainVi: 'Trong câu hỏi gián tiếp, sau từ hỏi "where" ta giữ nguyên trật tự khẳng định "S + V" (...where the nearest subway station is), không đảo "is" lên trước.',
    vocabNotes: [
      { word: 'nearest', phonetic: '/ˈnɪrɪst/', posVi: 'tính từ', meaningVi: 'gần nhất' },
      { word: 'subway station', phonetic: '/ˈsʌbweɪ ˈsteɪʃən/', posVi: 'danh từ', meaningVi: 'ga tàu điện ngầm' },
    ],
  },
  {
    id: 'en_x_tech_sent_1',
    lang: 'en',
    tier: 'intermediate',
    levelBand: 5,
    topic: 'study_tech',
    format: 'sentence_builder',
    promptVi: 'Sắp xếp các thẻ từ để nói: "Chúng ta phải hoàn thành bài thuyết trình trước hạn chót."',
    stemText: 'Chúng ta phải hoàn thành bài thuyết trình trước hạn chót.',
    fullSentence: 'We must finish the presentation before the deadline.',
    fullPhonetic: '/wiː mʌst ˈfɪnɪʃ ðə ˌprɛzənˈteɪʃən bɪˈfɔːr ðə ˈdɛdlaɪn/',
    translationVi: 'Chúng ta phải hoàn thành bài thuyết trình trước hạn chót.',
    orderedTokens: ['We', 'must', 'finish', 'the', 'presentation', 'before', 'the', 'deadline.'],
    distractorTokens: ['finishing'],
    grammarTitleVi: 'Động từ khuyết thiếu must + V nguyên mẫu',
    grammarExplainVi: 'Sau "must" luôn dùng động từ nguyên mẫu không "to" ("finish"), đi kèm cụm giới từ chỉ thời hạn "before the deadline".',
    vocabNotes: [
      { word: 'presentation', phonetic: '/ˌprɛzənˈteɪʃən/', posVi: 'danh từ', meaningVi: 'bài thuyết trình' },
      { word: 'deadline', phonetic: '/ˈdɛdlaɪn/', posVi: 'danh từ', meaningVi: 'hạn chót' },
    ],
  },
  {
    id: 'en_x_health_cloze_1',
    lang: 'en',
    tier: 'intermediate',
    levelBand: 6,
    topic: 'health_hobby',
    format: 'grammar_cloze',
    promptVi: 'Chọn từ nối đúng cho câu lời khuyên sức khỏe:',
    stemText: 'She jogs every morning ____ she wants to improve her stamina.',
    stemPhonetic: '/ʃiː dʒɒɡz ˈɛvri ˈmɔːrnɪŋ ____ ʃiː wɒnts tu ɪmˈpruːv hɜːr ˈstæmɪnə/',
    fullSentence: 'She jogs every morning because she wants to improve her stamina.',
    fullPhonetic: '/ʃiː dʒɒɡz ˈɛvri ˈmɔːrnɪŋ bɪˈkɒz ʃiː wɒnts tu ɪmˈpruːv hɜːr ˈstæmɪnə/',
    translationVi: 'Cô ấy chạy bộ mỗi sáng vì muốn cải thiện sức bền của mình.',
    choices: ['because', 'although', 'unless', 'despite'],
    choicePhonetics: ['/bɪˈkɒz/', '/ɔːlˈðoʊ/', '/ənˈlɛs/', '/dɪˈspaɪt/'],
    correctIndex: 0,
    grammarTitleVi: 'Liên từ chỉ nguyên nhân: because + Mệnh đề',
    grammarExplainVi: 'Vế sau giải thích lý do cho hành động chạy bộ mỗi sáng và là một mệnh đề hoàn chỉnh (S + V) nên dùng "because".',
    vocabNotes: [
      { word: 'jog', phonetic: '/dʒɒɡ/', posVi: 'động từ', meaningVi: 'chạy bộ nhẹ' },
      { word: 'stamina', phonetic: '/ˈstæmɪnə/', posVi: 'danh từ', meaningVi: 'sức bền, thể lực' },
    ],
  },
  {
    id: 'en_x_magic_cloze_1',
    lang: 'en',
    tier: 'advanced',
    levelBand: 8,
    topic: 'magic',
    format: 'grammar_cloze',
    promptVi: 'Chọn cấu trúc chuẩn Hogwarts cho câu điều kiện pháp thuật:',
    stemText: 'Not only ____ the incantation accurately, but she also mastered nonverbal spells.',
    stemPhonetic: '/nɒt ˈoʊnli ____ ði ˌɪnkænˈteɪʃən ˈækjərətli/',
    fullSentence: 'Not only did she pronounce the incantation accurately, but she also mastered nonverbal spells.',
    fullPhonetic: '/nɒt ˈoʊnli dɪd ʃiː prəˈnaʊns ði ˌɪnkænˈteɪʃən ˈækjərətli, bʌt ʃiː ˈɔːlsoʊ ˈmæstərd nɒnˈvɜːrbəl spɛlz/',
    translationVi: 'Cô ấy không chỉ niệm câu chú chuẩn xác mà còn thành thạo cả bùa chú không lời.',
    choices: ['did she pronounce', 'she pronounced', 'does she pronounced', 'was she pronounce'],
    choicePhonetics: ['/dɪd ʃiː prəˈnaʊns/', '/ʃiː prəˈnaʊnst/', '/dʌz ʃiː/', '/wɒz ʃiː/'],
    correctIndex: 0,
    grammarTitleVi: 'Đảo ngữ nhấn mạnh: Not only + trợ động từ + S + V, but ... also',
    grammarExplainVi: 'Khi "Not only" đứng đầu câu ở thì quá khứ đơn, ta đảo trợ động từ "did" lên trước chủ ngữ "she" và đưa động từ chính về nguyên mẫu "pronounce".',
    vocabNotes: [
      { word: 'incantation', phonetic: '/ˌɪnkænˈteɪʃən/', posVi: 'danh từ', meaningVi: 'câu niệm chú' },
      { word: 'nonverbal', phonetic: '/nɒnˈvɜːrbəl/', posVi: 'tính từ', meaningVi: 'không lời (bùa chú im lặng)' },
    ],
  },
];
