import { CuratedQuizItem, QuizLexiconEntry } from '../languageQuizBank';
import { buildPackLexicon } from './packHelper';

// +100 từ vựng Tiếng Hàn mở rộng (5 chủ đề × 20 từ: 36 Sơ cấp, 40 Trung cấp, 24 Cao cấp)
export const KO_EXPANDED_LEXICON: QuizLexiconEntry[] = [
  // ==================== 1. GIAO TIẾP, CẢM XÚC & QUAN HỆ (daily — 20 từ) ====================
  ...buildPackLexicon('ko', 1, 'beginner', [
    ['x_chingu', '친구', 'chin-gu', 'danh từ', 'bạn bè', '주말에 친한 친구와 영화를 보기로 했어요.', 'Ju-ma-re chin-han chin-gu-wa yeong-hwa-reul bo-gi-ro hae-sseo-yo.', 'Cuối tuần tôi đã hẹn đi xem phim với bạn thân.'],
    ['x_miso', '미소', 'mi-so', 'danh từ', 'nụ cười hiền', '따뜻한 미소가 사람의 마음을 열어 줘요.', 'Tta-tteu-than mi-so-ga sa-ra-mui ma-eu-meul yeo-reo jwo-yo.', 'Nụ cười ấm áp mở rộng trái tim con người.'],
    ['x_saengil', '생일', 'saeng-il', 'danh từ', 'ngày sinh nhật', '오늘은 동생 생일이라서 케이크를 샀어요.', 'O-neu-reun dong-saeng saeng-i-ri-ra-seo ke-i-keu-reul sa-sseo-yo.', 'Hôm nay là sinh nhật em nên tôi đã mua bánh kem.'],
  ], 'daily'),
  ...buildPackLexicon('ko', 2, 'beginner', [
    ['x_sagwahada', '사과하다', 'sa-gwa-ha-da', 'động từ', 'xin lỗi', '약속에 늦어서 바로 전화로 사과했어요.', 'Yak-so-ge neu-jeo-seo ba-ro jeon-hwa-ro sa-gwa-hae-sseo-yo.', 'Vì trễ hẹn nên tôi gọi điện xin lỗi ngay lập tức.'],
    ['x_sinna', '신나다', 'sin-na-da', 'động từ/tính từ', 'hào hứng, vui sướng', '여행 갈 생각에 벌써부터 너무 신나요.', 'Yeo-haeng gal saeng-ga-ge beol-sseo-bu-teo neo-mu sin-na-yo.', 'Nghĩ tới chuyến du lịch thôi mà đã thấy hào hứng quá rồi.'],
    ['x_poong', '포옹', 'po-ong', 'danh từ', 'cái ôm ấm áp', '공항에서 오랜만에 만난 친구와 반갑게 포옹했어요.', 'Gong-hang-e-seo o-raen-ma-ne man-nan chin-gu-wa ban-gap-ge po-ong-hae-sseo-yo.', 'Tôi ôm chầm người bạn lâu ngày gặp lại ở sân bay.'],
  ], 'daily'),
  ...buildPackLexicon('ko', 3, 'beginner', [
    ['x_soljik', '솔직하다', 'sol-ji-kha-da', 'tính từ', 'thẳng thắn, chân thật', '솔직하게 말해 줘서 정말 고마워요.', 'Sol-ji-kha-ge mal-hae jwo-seo jeong-mal go-ma-wo-yo.', 'Cảm ơn bạn đã nói thật lòng với mình.'],
    ['x_oeropda', '외롭다', 'oe-rop-da', 'tính từ', 'cô đơn, trống trải', '타지에 혼자 살다 보면 가끔 외로울 때가 있어요.', 'Ta-ji-e hon-ja sal-da bo-myeon ga-kkeum oe-ro-ul ttae-ga i-sseo-yo.', 'Sống một mình nơi xa đôi khi có lúc thấy cô đơn.'],
  ], 'daily'),
  ...buildPackLexicon('ko', 4, 'intermediate', [
    ['x_eungwon', '응원하다', 'eung-won-ha-da', 'động từ', 'cổ vũ, khích lệ', '가족들이 항상 제 꿈을 진심으로 응원해 줘요.', 'Ga-jok-deu-ri hang-sang je kku-meul jin-si-meu-ro eung-won-hae jwo-yo.', 'Gia đình luôn hết lòng cổ vũ ước mơ của tôi.'],
    ['x_bukkeureop', '부끄럽다', 'bu-kkeu-reop-da', 'tính từ', 'ngượng ngùng, xấu hổ', '발표 중에 실수해서 얼굴이 빨개질 만큼 부끄러웠어요.', 'Bal-pyo jung-e sil-su-hae-seo eol-gu-ri ppal-gae-jil man-keum bu-kkeu-reo-wo-sseo-yo.', 'Tôi ngượng đỏ mặt vì lỡ nói nhầm giữa lúc thuyết trình.'],
  ], 'daily'),
  ...buildPackLexicon('ko', 5, 'intermediate', [
    ['x_ohae', '오해', 'o-hae', 'danh từ', 'sự hiểu lầm', '직접 만나서 이야기하니 오해가 금방 풀렸어요.', 'Jik-jeop man-na-seo i-ya-gi-ha-ni o-hae-ga geum-bang pul-lyeo-sseo-yo.', 'Gặp trực tiếp nói chuyện là hiểu lầm được hóa giải ngay.'],
    ['x_deundeun', '든든하다', 'deun-deun-ha-da', 'tính từ', 'vững tâm, đáng tin cậy', '어려울 때 곁에 있어 주는 친구가 있어 든든해요.', 'Eo-ryeo-ul ttae gyeo-te i-sseo ju-neun chin-gu-ga i-sseo deun-deun-hae-yo.', 'Có người bạn ở bên lúc khó khăn khiến tôi thật vững tâm.'],
  ], 'daily'),
  ...buildPackLexicon('ko', 6, 'intermediate', [
    ['x_tahyeop', '타협하다', 'ta-hyeop-ha-da', 'động từ', 'thỏa hiệp, nhượng bộ', '서로 조금씩 양보하며 좋은 조건으로 타협했어요.', 'Seo-ro jo-geum-ssik yang-bo-ha-myeo jo-eun jo-geo-neu-ro ta-hyeop-hae-sseo-yo.', 'Hai bên cùng nhường nhau một chút để đi đến thỏa hiệp tốt đẹp.'],
    ['x_sojung', '소중하다', 'so-jung-ha-da', 'tính từ', 'quý giá, trân quý', '함께 웃었던 평범한 일상이 가장 소중해요.', 'Ham-kke u-sseo-tteon pyeong-beom-han il-sang-i ga-jang so-jung-hae-yo.', 'Những ngày bình dị cùng nhau cười nói là điều quý giá nhất.'],
  ], 'daily'),
  ...buildPackLexicon('ko', 7, 'intermediate', [
    ['x_wiro', '위로하다', 'wi-ro-ha-da', 'động từ', 'an ủi, vỗ về', '지친 친구에게 따뜻한 차를 건네며 위로했어요.', 'Ji-chin chin-gu-e-ge tta-tteu-than cha-reul geon-ne-myeo wi-ro-hae-sseo-yo.', 'Tôi đưa tách trà ấm và an ủi người bạn đang mệt mỏi.'],
    ['x_sinroe', '신뢰', 'sin-loe', 'danh từ', 'sự tin tưởng, tín nhiệm', '오랜 시간 쌓아 온 신뢰는 쉽게 무너지지 않아요.', 'O-raen si-gan ssa-a on sin-loe-neun swip-ge mu-neo-ji-ji a-na-yo.', 'Niềm tin gây dựng qua thời gian dài không dễ gì lung lay.'],
  ], 'daily'),
  ...buildPackLexicon('ko', 8, 'advanced', [
    ['x_gonggam', '공감', 'gong-gam', 'danh từ', 'sự đồng cảm, thấu cảm', '진정한 공감은 상대방의 말을 끝까지 듣는 데서 시작된다.', 'Jin-jeong-han gong-ga-meun sang-dae-bang-ui ma-reul kkeut-kka-ji deut-neun de-seo si-jak-doen-da.', 'Sự thấu cảm thực sự bắt đầu từ việc lắng nghe đối phương tới cùng.'],
    ['x_hwahae', '화해하다', 'hwa-hae-ha-da', 'động từ', 'hòa giải, làm lành', '다툰 두 친구는 편지를 주고받으며 마침내 화해했다.', 'Da-tun du chin-gu-neun pyeon-ji-reul ju-go-ba-deu-myeo ma-chim-nae hwa-hae-haet-da.', 'Hai người bạn cãi nhau cuối cùng đã làm lành qua những lá thư.'],
  ], 'daily'),
  ...buildPackLexicon('ko', 9, 'advanced', [
    ['x_unbyeon', '유창하다', 'yu-chang-ha-da', 'tính từ', 'lưu loát, trôi chảy', '그녀는 세 개 국어를 놀라울 만큼 유창하게 구사한다.', 'Geu-nyeo-neun se gae gu-geo-reul nol-la-ul man-keum yu-chang-ha-ge gu-sa-han-da.', 'Cô ấy sử dụng ba ngoại ngữ lưu loát đến đáng kinh ngạc.'],
  ], 'daily'),
  ...buildPackLexicon('ko', 10, 'advanced', [
    ['x_yudae', '유대감', 'yu-dae-gam', 'danh từ', 'tình gắn kết bền chặt', '어려운 대회를 함께 준비하며 깊은 유대감이 생겼다.', 'Eo-ryeo-un dae-hoe-reul ham-kke jun-bi-ha-myeo gi-peun yu-dae-ga-mi saeng-gyeot-da.', 'Cùng chuẩn bị cho giải đấu khó đã tạo nên sự gắn kết sâu sắc.'],
  ], 'daily'),

  // ==================== 2. DU LỊCH, ĂN UỐNG, MUA SẮM & THÀNH PHỐ (travel — 20 từ) ====================
  ...buildPackLexicon('ko', 1, 'beginner', [
    ['x_yeogwon', '여권', 'yeo-gwon', 'danh từ', 'hộ chiếu', '해외여행 갈 때 여권을 꼭 챙겨야 해요.', 'Hae-oe-yeo-haeng gal ttae yeo-gwo-neul kkok chaeng-gyeo-ya hae-yo.', 'Khi đi du lịch nước ngoài nhất định phải mang theo hộ chiếu.'],
    ['x_gonghang', '공항', 'gong-hang', 'danh từ', 'sân bay', '비행기 출발 두 시간 전에 공항에 도착했어요.', 'Bi-haeng-gi chul-bal du si-gan jeo-ne gong-hang-e do-cha-khae-sseo-yo.', 'Tôi đã có mặt ở sân bay hai tiếng trước giờ máy bay cất cánh.'],
    ['x_pyo', '표', 'pyo', 'danh từ', 'tấm vé', '인터넷으로 부산행 기차 표를 미리 예매했어요.', 'In-teo-ne-seu-ro Bu-san-haeng gi-cha pyo-reul mi-ri ye-mae-hae-sseo-yo.', 'Tôi đã đặt trước vé tàu đi Busan qua mạng.'],
  ], 'travel'),
  ...buildPackLexicon('ko', 2, 'beginner', [
    ['x_hotel', '호텔', 'ho-tel', 'danh từ', 'khách sạn', '바다가 보이는 조용한 호텔에서 하룻밤 묵었어요.', 'Ba-da-ga bo-i-neun jo-yong-han ho-te-re-seo ha-rut-bam mu-geo-sseo-yo.', 'Tôi nghỉ một đêm tại khách sạn yên tĩnh nhìn ra biển.'],
    ['x_menyu', '메뉴', 'me-nyu', 'danh từ', 'thực đơn', '이 식당에서 가장 인기 있는 메뉴가 뭐예요?', 'I sik-dang-e-seo ga-jang in-gi it-neun me-nyu-ga mwo-ye-yo?', 'Món được yêu thích nhất trong thực đơn quán này là gì vậy?'],
    ['x_yeongsujeung', '영수증', 'yeong-su-jeung', 'danh từ', 'hóa đơn thanh toán', '교환할 수도 있으니 영수증을 버리지 마세요.', 'Gyo-hwan-hal su-do i-sseu-ni yeong-su-jeung-eul beo-ri-ji ma-se-yo.', 'Có thể cần đổi hàng nên đừng vứt hóa đơn nhé.'],
  ], 'travel'),
  ...buildPackLexicon('ko', 3, 'beginner', [
    ['x_jihacheol', '지하철', 'ji-ha-cheol', 'danh từ', 'tàu điện ngầm', '출근 시간에는 지하철이 버스보다 훨씬 빨라요.', 'Chul-geun si-ga-ne-neun ji-ha-cheo-ri beo-seu-bo-da hwol-ssin ppal-la-yo.', 'Giờ đi làm thì tàu điện ngầm nhanh hơn xe buýt nhiều.'],
    ['x_jido', '지도', 'ji-do', 'danh từ', 'bản đồ', '길을 잃지 않도록 휴대폰 지도를 확인했어요.', 'Gi-reul il-chi an-to-rok hyu-dae-pon ji-do-reul hwa-gin-hae-sseo-yo.', 'Tôi xem bản đồ trên điện thoại để không bị lạc đường.'],
  ], 'travel'),
  ...buildPackLexicon('ko', 4, 'intermediate', [
    ['x_jim', '짐', 'jim', 'danh từ', 'hành lý', '여행 가방에 필요한 짐을 미리 싸 두었어요.', 'Yeo-haeng ga-bang-e pi-ryo-han ji-meul mi-ri ssa du-eo-sseo-yo.', 'Tôi đã xếp sẵn hành lý cần thiết vào vali.'],
    ['x_yeyak', '예약', 'ye-yak', 'danh từ', 'việc đặt chỗ trước', '주말 저녁에는 미리 예약해야 자리를 잡을 수 있어요.', 'Ju-mal jeo-nyeo-ge-neun mi-ri ye-ya-khae-ya ja-ri-reul ja-beul su i-sseo-yo.', 'Tối cuối tuần phải đặt trước mới có chỗ ngồi.'],
  ], 'travel'),
  ...buildPackLexicon('ko', 5, 'intermediate', [
    ['x_chulbal', '출발', 'chul-bal', 'danh từ', 'sự khởi hành', '기차 출발 시각이 십 분 남았으니 서둘러요.', 'Gi-cha chul-bal si-ga-gi sip bun na-ma-sseu-ni seo-dul-leo-yo.', 'Còn mười phút nữa là tới giờ tàu khởi hành, nhanh lên nào.'],
    ['x_ginyeompum', '기념품', 'gi-nyeom-pum', 'danh từ', 'quà lưu niệm', '제주도에서 가족들에게 줄 기념품을 골랐어요.', 'Je-ju-do-e-seo ga-jok-deu-re-ge jul gi-nyeom-pu-meul gol-la-sseo-yo.', 'Tôi đã chọn quà lưu niệm ở đảo Jeju để tặng gia đình.'],
  ], 'travel'),
  ...buildPackLexicon('ko', 6, 'intermediate', [
    ['x_iljeong', '일정', 'il-jeong', 'danh từ', 'lịch trình', '이번 삼 박 사 일 여행 일정이 정말 알차요.', 'I-beon sam bak sa il yeo-haeng il-jeong-i jeong-mal al-cha-yo.', 'Lịch trình du lịch 3 đêm 4 ngày lần này thật đầy đặn thú vị.'],
    ['x_halin', '할인', 'ha-rin', 'danh từ', 'giảm giá, chiết khấu', '학생증을 보여 주면 입장료를 할인받을 수 있어요.', 'Hak-saeng-jeung-eul bo-yeo ju-myeon ip-jang-nyo-reul ha-rin-ba-deul su i-sseo-yo.', 'Xuất trình thẻ học sinh sẽ được giảm giá vé vào cửa.'],
  ], 'travel'),
  ...buildPackLexicon('ko', 7, 'intermediate', [
    ['x_sageori', '사거리', 'sa-geo-ri', 'danh từ', 'ngã tư đường phố', '큰 사거리에서 오른쪽으로 돌면 서점이 나와요.', 'Keun sa-geo-ri-e-seo o-reun-jjo-geu-ro dol-myeon seo-jeo-mi na-wa-yo.', 'Rẽ phải ở ngã tư lớn là thấy hiệu sách hiện ra.'],
    ['x_hwanjeon', '환전', 'hwan-jeon', 'danh từ', 'đổi ngoại tệ', '출국하기 전에 은행에서 엔화로 환전했어요.', 'Chul-gu-kha-gi jeo-ne eun-haeng-e-seo en-hwa-ro hwan-jeon-hae-sseo-yo.', 'Trước khi xuất cảnh tôi đã đổi sang tiền Yên ở ngân hàng.'],
  ], 'travel'),
  ...buildPackLexicon('ko', 8, 'advanced', [
    ['x_gukje', '국제적이다', 'guk-je-jeo-gi-da', 'tính từ', 'mang tầm quốc tế, đa văn hóa', '서울은 전통과 현대가 어우러진 국제적인 도시다.', 'Seo-u-reun jeon-tong-gwa hyeon-dae-ga eo-u-reo-jin guk-je-jeo-gin do-si-da.', 'Seoul là đô thị quốc tế nơi truyền thống hòa quyện cùng hiện đại.'],
    ['x_hwandae', '환대', 'hwan-dae', 'danh từ', 'sự tiếp đón nồng hậu', '낯선 마을에서 받은 따뜻한 환대를 잊을 수 없다.', 'Nat-seon ma-eu-re-seo ba-deun tta-tteu-than hwan-dae-reul i-jeul su eop-da.', 'Không thể nào quên sự tiếp đón nồng hậu nơi ngôi làng xa lạ.'],
  ], 'travel'),
  ...buildPackLexicon('ko', 9, 'advanced', [
    ['x_tamheom', '탐험', 'tam-heom', 'danh từ', 'cuộc thám hiểm, khám phá', '숨겨진 해안 동굴을 찾아 떠난 탐험이 짜릿했다.', 'Sum-gyeo-jin hae-an dong-gu-reul cha-ja tteo-nan tam-heo-mi jja-ri-thaet-da.', 'Chuyến thám hiểm đi tìm hang động ven biển ẩn giấu thật hồi hộp.'],
  ], 'travel'),
  ...buildPackLexicon('ko', 10, 'advanced', [
    ['x_yeojeong', '여정', 'yeo-jeong', 'danh từ', 'chặng đường, hành trình dài', '유럽 대륙을 기차로 횡단하는 여정은 꿈만 같았다.', 'Yu-reop dae-ryu-geul gi-cha-ro hoeng-dan-ha-neun yeo-jeong-eun kkum-man ga-tat-da.', 'Hành trình đi tàu xuyên lục địa châu Âu đẹp tựa giấc mơ.'],
  ], 'travel'),

  // ==================== 3. HỌC TẬP, CÔNG VIỆC & CÔNG NGHỆ (study_tech — 20 từ) ====================
  ...buildPackLexicon('ko', 1, 'beginner', [
    ['x_gongchaek', '공책', 'gong-chaek', 'danh từ', 'quyển vở ghi chép', '새 공책에 오늘 배운 표현을 정리했어요.', 'Sae gong-chae-ge o-neul bae-un pyo-hyeo-neul jeong-ni-hae-sseo-yo.', 'Tôi ghi lại các mẫu câu học hôm nay vào quyển vở mới.'],
    ['x_doseogwan', '도서관', 'do-seo-gwan', 'danh từ', 'thư viện', '시험 기간에는 도서관이 학생들로 가득 차요.', 'Si-heom gi-ga-ne-neun do-seo-gwa-ni hak-saeng-deul-lo ga-deuk cha-yo.', 'Mùa thi thư viện lúc nào cũng kín sinh viên.'],
    ['x_mesiji', '메시지', 'me-si-ji', 'danh từ', 'tin nhắn', '집에 도착하면 바로 메시지 보내 줘요.', 'Ji-be do-cha-kha-myeon ba-ro me-si-ji bo-nae jwo-yo.', 'Về đến nhà nhớ nhắn tin cho mình ngay nhé.'],
  ], 'study_tech'),
  ...buildPackLexicon('ko', 2, 'beginner', [
    ['x_kibodeu', '키보드', 'ki-bo-deu', 'danh từ', 'bàn phím', '조용한 무선 키보드로 바꾸니까 일하기 편해요.', 'Jo-yong-han mu-seon ki-bo-deu-ro ba-kku-ni-kka il-ha-gi pyeon-hae-yo.', 'Đổi sang bàn phím không dây êm ái nên làm việc thật thoải mái.'],
    ['x_bimilbeonho', '비밀번호', 'bi-mil-beon-ho', 'danh từ', 'mật khẩu', '안전하게 비밀번호를 정기적으로 변경하세요.', 'An-jeon-ha-ge bi-mil-beon-ho-reul jeong-gi-jeo-geu-ro byeon-gyeong-ha-se-yo.', 'Hãy đổi mật khẩu định kỳ để giữ an toàn tài khoản.'],
  ], 'study_tech'),
  ...buildPackLexicon('ko', 3, 'beginner', [
    ['x_sukje', '숙제', 'suk-je', 'danh từ', 'bài tập về nhà', '저녁 먹기 전에 영어 숙제를 다 끝냈어요.', 'Jeo-nyeok meok-gi jeo-ne yeong-eo suk-je-reul da kkeut-nae-sseo-yo.', 'Tôi làm xong hết bài tập tiếng Anh trước bữa tối.'],
    ['x_hoeui', '회의', 'hoe-ui', 'danh từ', 'cuộc họp', '오전 열 시에 팀 프로젝트 회의가 시작돼요.', 'O-jeon yeol si-e tim peu-ro-jek-teu hoe-ui-ga si-jak-dwae-yo.', 'Cuộc họp dự án nhóm bắt đầu lúc mười giờ sáng.'],
  ], 'study_tech'),
  ...buildPackLexicon('ko', 4, 'intermediate', [
    ['x_magam', '마감', 'ma-gam', 'danh từ', 'hạn chót nộp bài/dự án', '보고서 마감 시간을 지키려고 열심히 준비했어요.', 'Bo-go-seo ma-gam si-ga-neul ji-ki-ryeo-go yeol-sim-hi jun-bi-hae-sseo-yo.', 'Tôi chuẩn bị chăm chỉ để kịp hạn chót nộp báo cáo.'],
    ['x_dongnyo', '동료', 'dong-nyo', 'danh từ', 'đồng nghiệp', '친절한 동료가 새 프로그램 사용법을 알려 줬어요.', 'Chin-jeol-han dong-nyo-ga sae peu-ro-geu-raem sa-yong-beo-beul al-lyeo jwo-sseo-yo.', 'Người đồng nghiệp tốt bụng đã chỉ tôi cách dùng phần mềm mới.'],
  ], 'study_tech'),
  ...buildPackLexicon('ko', 5, 'intermediate', [
    ['x_janghakgeum', '장학금', 'jang-hak-geum', 'danh từ', 'học bổng', '성적이 우수해서 이번 학기 장학금을 받았어요.', 'Seong-jeo-gi u-su-hae-seo i-beon hak-gi jang-hak-geu-meul ba-da-sseo-yo.', 'Nhờ thành tích xuất sắc mà học kỳ này tôi nhận được học bổng.'],
    ['x_allim', '알림', 'al-lim', 'danh từ', 'thông báo trên ứng dụng', '공부에 집중할 때는 휴대폰 알림을 꺼 두세요.', 'Gong-bu-e jip-jung-hal ttae-neun hyu-dae-pon al-li-meul kkeo du-se-yo.', 'Khi tập trung học bài hãy tắt thông báo điện thoại đi nhé.'],
  ], 'study_tech'),
  ...buildPackLexicon('ko', 6, 'intermediate', [
    ['x_balpyo', '발표', 'bal-pyo', 'danh từ', 'bài thuyết trình, công bố', '철저히 연습한 덕분에 발표를 성공적으로 마쳤어요.', 'Cheol-jeo-hi yeon-seu-phan deok-bu-ne bal-pyo-reul seong-gong-jeo-geu-ro ma-chyeo-sseo-yo.', 'Nhờ luyện tập kỹ lưỡng nên tôi đã hoàn thành bài thuyết trình thành công.'],
    ['x_pideubaek', '피드백', 'pi-deu-baek', 'danh từ', 'phản hồi, góp ý', '팀원들의 솔직한 피드백을 반영해 디자인을 개선했어요.', 'Tim-won-deu-rui sol-ji-khan pi-deu-bae-geul ban-yeong-hae di-ja-i-neul gae-seon-hae-sseo-yo.', 'Tôi cải thiện thiết kế dựa trên góp ý thẳng thắn của các thành viên.'],
  ], 'study_tech'),
  ...buildPackLexicon('ko', 7, 'intermediate', [
    ['x_algorijeum', '알고리즘', 'al-go-ri-jeum', 'danh từ', 'thuật toán', '새로운 추천 알고리즘이 내 취향에 맞는 노래를 찾아 줘요.', 'Sae-ro-un chu-cheon al-go-ri-jeu-mi nae chwi-hyang-e mat-neun no-rae-reul cha-ja jwo-yo.', 'Thuật toán gợi ý mới tìm ra những bài hát hợp gu của tôi.'],
    ['x_aepeul', '응용 프로그램', 'eung-yong peu-ro-geu-raem', 'danh từ', 'ứng dụng phần mềm', '매일 단어를 복습할 수 있는 유용한 응용 프로그램이에요.', 'Mae-il da-neo-reul bok-seu-phal su it-neun yu-yong-han eung-yong peu-ro-geu-rae-mi-e-yo.', 'Đây là ứng dụng hữu ích giúp ôn tập từ vựng mỗi ngày.'],
  ], 'study_tech'),
  ...buildPackLexicon('ko', 8, 'advanced', [
    ['x_hyeoksin', '혁신', 'hyeok-sin', 'danh từ', 'sự đổi mới đột phá', '친환경 기술 혁신이 미래 도시의 모습을 바꾸고 있다.', 'Chin-hwan-gyeong gi-sul hyeok-si-ni mi-rae do-si-ui mo-seu-beul ba-kku-go it-da.', 'Đổi mới công nghệ xanh đang thay đổi diện mạo đô thị tương lai.'],
    ['x_amhohwa', '암호화', 'am-ho-hwa', 'danh từ', 'sự mã hóa dữ liệu', '강력한 암호화 기술로 개인 정보를 안전하게 보호한다.', 'Gang-nyeok-han am-ho-hwa gi-sul-lo gae-in jeong-bo-reul an-jeon-ha-ge bo-ho-han-da.', 'Công nghệ mã hóa mạnh giúp bảo vệ an toàn thông tin cá nhân.'],
  ], 'study_tech'),
  ...buildPackLexicon('ko', 9, 'advanced', [
    ['x_sungnyeon', '숙련도', 'sung-nyeon-do', 'danh từ', 'mức độ thành thạo', '꾸준한 회화 연습이 외국어 숙련도를 크게 높여 준다.', 'Kku-jun-han hoe-hwa yeon-seu-bi oe-gu-geo sung-nyeon-do-reul keu-ge no-pyeo jun-da.', 'Luyện hội thoại đều đặn nâng cao đáng kể độ thành thạo ngoại ngữ.'],
    ['x_jadonghwa', '자동화', 'ja-dong-hwa', 'danh từ', 'tự động hóa', '반복 작업을 자동화하여 업무 효율을 두 배로 올렸다.', 'Ban-bok ja-geo-beul ja-dong-hwa-ha-yeo eom-mu hyo-yu-reul du bae-ro ol-lyeot-da.', 'Tự động hóa tác vụ lặp lại giúp tăng gấp đôi hiệu suất công việc.'],
  ], 'study_tech'),
  ...buildPackLexicon('ko', 10, 'advanced', [
    ['x_paereodaim', '패러다임', 'pae-reo-da-im', 'danh từ', 'hệ hình tư duy mới', '인공지능의 발전은 교육 방식의 패러다임을 전환했다.', 'In-gong-ji-neung-ui bal-jeo-neun gyo-yuk bang-si-gui pae-reo-da-i-meul jeon-hwan-haet-da.', 'Sự phát triển của AI đã chuyển dịch hoàn toàn mô hình giáo dục.'],
  ], 'study_tech'),

  // ==================== 4. SỨC KHỎE, THỂ THAO, ÂM NHẠC & GIẢI TRÍ (health_hobby — 20 từ) ====================
  ...buildPackLexicon('ko', 1, 'beginner', [
    ['x_byeongwon', '병원', 'byeong-won', 'danh từ', 'bệnh viện', '감기가 심해져서 아침에 근처 병원에 갔어요.', 'Gam-gi-ga sim-hae-jyeo-seo a-chi-me geun-cheo byeong-wo-ne ga-sseo-yo.', 'Cảm nặng hơn nên sáng nay tôi đã đến bệnh viện gần nhà.'],
    ['x_yeol', '열', 'yeol', 'danh từ', 'cơn sốt', '밤에 열이 많이 나면 바로 물수건으로 식혀 주세요.', 'Ba-me yeo-ri ma-ni na-myeon ba-ro mul-su-geo-neu-ro si-kyeo ju-se-yo.', 'Đêm nếu sốt cao thì nhớ chườm khăn mát ngay nhé.'],
    ['x_gita', '기타', 'gi-ta', 'danh từ', 'đàn ghi-ta', '취미로 매주 토요일마다 통기타를 배우고 있어요.', 'Chwi-mi-ro mae-ju to-yo-il-ma-da tong-gi-ta-reul bae-u-go i-sseo-yo.', 'Tôi đang học đàn ghi-ta thùng vào mỗi thứ Bảy như một sở thích.'],
  ], 'health_hobby'),
  ...buildPackLexicon('ko', 2, 'beginner', [
    ['x_yak', '약', 'yak', 'danh từ', 'thuốc chữa bệnh', '식사 후 삼십 분 뒤에 이 약을 드세요.', 'Sik-sa hu sam-sip bun dwi-e i ya-geul deu-se-yo.', 'Hãy uống thuốc này ba mươi phút sau khi ăn.'],
    ['x_konseoteu', '콘서트', 'kon-seo-teu', 'danh từ', 'buổi hòa nhạc', '좋아하는 가수의 콘서트 표를 드디어 구했어요!', 'Jo-a-ha-neun ga-su-ui kon-seo-teu pyo-reul deu-di-eo gu-hae-sseo-yo!', 'Cuối cùng tôi cũng săn được vé buổi hòa nhạc của ca sĩ yêu thích!'],
  ], 'health_hobby'),
  ...buildPackLexicon('ko', 3, 'beginner', [
    ['x_suyeong', '수영', 'su-yeong', 'danh từ', 'môn bơi lội', '아침에 수영을 하면 하루 종일 몸이 가벼워요.', 'A-chi-me su-yeong-eul ha-myeon ha-ru jong-il mo-mi ga-byeo-wo-yo.', 'Bơi buổi sáng giúp cả ngày cơ thể nhẹ nhõm khoan khoái.'],
    ['x_kamera', '카메라', 'ka-me-ra', 'danh từ', 'máy ảnh', '필름 카메라로 노을 지는 바다를 찍었어요.', 'Pil-leum ka-me-ra-ro no-eul ji-neun ba-da-reul jji-geo-sseo-yo.', 'Tôi chụp biển hoàng hôn bằng máy ảnh phim.'],
  ], 'health_hobby'),
  ...buildPackLexicon('ko', 4, 'intermediate', [
    ['x_yeongyang', '영양', 'yeong-yang', 'danh từ', 'dinh dưỡng', '균형 잡힌 영양 섭취가 건강의 기본이에요.', 'Gyun-hyeong ja-pin yeong-yang seop-chwi-ga geon-gang-ui gi-bo-ni-e-yo.', 'Bổ sung dinh dưỡng cân bằng là nền tảng của sức khỏe.'],
    ['x_mellodi', '멜로디', 'mel-lo-di', 'danh từ', 'giai điệu', '잔잔한 피아노 멜로디가 마음을 차분하게 해 줘요.', 'Jan-jan-han pi-a-no mel-lo-di-ga ma-eu-meul cha-bun-ha-ge hae jwo-yo.', 'Giai điệu piano êm dịu giúp tâm hồn bình yên lại.'],
  ], 'health_hobby'),
  ...buildPackLexicon('ko', 5, 'intermediate', [
    ['x_cheryeok', '체력', 'che-ryeok', 'danh từ', 'thể lực, sức bền', '등산을 꾸준히 다니면서 체력이 많이 좋아졌어요.', 'Deung-sa-neul kku-jun-hi da-ni-myeon-seo che-ryeo-gi ma-ni jo-a-jyeo-sseo-yo.', 'Nhờ leo núi đều đặn mà thể lực của tôi tốt lên hẳn.'],
    ['x_gamdok', '감독', 'gam-dok', 'danh từ', 'đạo diễn, huấn luyện viên', '이 영화 감독은 섬세한 연출로 세계적인 상을 받았어요.', 'I yeong-hwa gam-do-geun seom-se-han yeon-chul-lo se-gye-jeo-gin sang-eul ba-da-sseo-yo.', 'Vị đạo diễn phim này đoạt giải quốc tế nhờ lối dàn dựng tinh tế.'],
  ], 'health_hobby'),
  ...buildPackLexicon('ko', 6, 'intermediate', [
    ['x_cheobangjeon', '처방전', 'cheo-bang-jeon', 'danh từ', 'đơn thuốc của bác sĩ', '병원에서 받은 처방전을 약국에 제출하세요.', 'Byeong-wo-ne-seo ba-deun cheo-bang-jeo-neul yak-gu-ge je-chul-ha-se-yo.', 'Hãy nộp đơn thuốc nhận từ bệnh viện cho nhà thuốc.'],
    ['x_jeonsihoe', '전시회', 'jeon-si-hoe', 'danh từ', 'buổi triển lãm', '주말에 미술관에서 열리는 사진 전시회에 갈 거예요.', 'Ju-ma-re mi-sul-gwa-ne-seo yeol-li-neun sa-jin jeon-si-hoe-e gal geo-ye-yo.', 'Cuối tuần tôi sẽ đi xem triển lãm nhiếp ảnh ở bảo tàng mỹ thuật.'],
  ], 'health_hobby'),
  ...buildPackLexicon('ko', 7, 'intermediate', [
    ['x_maraton', '마라톤', 'ma-ra-ton', 'danh từ', 'cuộc chạy ma-ra-tông', '반년 동안 훈련해서 첫 마라톤 완주에 성공했어요.', 'Ban-nyeon dong-an hul-lyeon-hae-seo cheot ma-ra-ton wan-ju-e seong-gong-hae-sseo-yo.', 'Tập luyện nửa năm trời và tôi đã về đích giải ma-ra-tông đầu tiên.'],
    ['x_myeongsang', '명상', 'myeong-sang', 'danh từ', 'thiền định', '잠들기 전 십 분 명상으로 하루의 피로를 풀어요.', 'Jam-deul-gi jeon sip bun myeong-sang-eu-ro ha-ru-ui pi-ro-reul pu-reo-yo.', 'Mười phút thiền trước khi ngủ giúp xua tan mệt mỏi cả ngày.'],
  ], 'health_hobby'),
  ...buildPackLexicon('ko', 8, 'advanced', [
    ['x_myeonyeok', '면역력', 'myeo-nyeong-nyeok', 'danh từ', 'sức đề kháng, miễn dịch', '충분한 수면과 운동은 자연 면역력을 강화한다.', 'Chung-bun-han su-myeon-gwa un-dong-eun ja-yeon myeo-nyeong-nyeo-geul gang-hwa-han-da.', 'Ngủ đủ giấc và tập thể dục củng cố hệ miễn dịch tự nhiên.'],
    ['x_geoljak', '걸작', 'geol-jak', 'danh từ', 'kiệt tác nghệ thuật', '이 교향곡은 시대를 초월한 음악사의 걸작으로 꼽힌다.', 'I gyo-hyang-go-geun si-dae-reul cho-wol-han eu-mak-sa-ui geol-ja-geu-ro kko-pin-da.', 'Bản giao hưởng này được ca ngợi là kiệt tác vượt thời đại.'],
  ], 'health_hobby'),
  ...buildPackLexicon('ko', 9, 'advanced', [
    ['x_anmu', '안무', 'an-mu', 'danh từ', 'vũ đạo, biên đạo múa', '화려하면서도 절도 있는 안무가 관객의 시선을 사로잡았다.', 'Hwa-ryeo-ha-myeon-seo-do jeol-do it-neun an-mu-ga gwan-gae-gui si-seo-neul sa-ro-ja-bat-da.', 'Vũ đạo vừa rực rỡ vừa dứt khoát đã cuốn hút mọi ánh nhìn khán giả.'],
    ['x_jaehwal', '재활', 'jae-hwal', 'danh từ', 'phục hồi chức năng', '성실한 재활 치료 끝에 선수는 다시 경기장에 섰다.', 'Seong-sil-han jae-hwal chi-ryo kkeu-te seon-su-neun da-si gyeong-gi-jang-e seot-da.', 'Sau quá trình tập phục hồi kiên trì, vận động viên đã trở lại sân đấu.'],
  ], 'health_hobby'),
  ...buildPackLexicon('ko', 10, 'advanced', [
    ['x_katareusiseu', '카타르시스', 'ka-ta-reu-si-seu', 'danh từ', 'sự giải tỏa cảm xúc sâu sắc', '연극의 마지막 장면은 관객에게 깊은 카타르시스를 안겼다.', 'Yeon-geu-gui ma-ji-mak jang-myeo-neun gwan-gae-ge-ge gi-peun ka-ta-reu-si-seu-reul an-gyeot-da.', 'Cảnh kết vở kịch đem lại cho khán giả sự giải tỏa cảm xúc sâu lắng.'],
  ], 'health_hobby'),

  // ==================== 5. THẾ GIỚI HARRY POTTER & PHÉP THUẬT (magic — 20 từ) ====================
  ...buildPackLexicon('ko', 1, 'beginner', [
    ['x_jipangi', '마법 지팡이', 'ma-beop ji-pang-i', 'danh từ', 'đũa phép', '지팡이가 스스로 마법사를 선택한다는 전설이 있어요.', 'Ji-pang-i-ga seu-seu-ro ma-beop-sa-reul seon-tae-khan-da-neun jeon-seo-ri i-sseo-yo.', 'Có truyền thuyết rằng chính đũa phép tự chọn phù thủy của mình.'],
    ['x_jumun', '주문', 'ju-mun', 'danh từ', 'thần chú, câu bùa', '밝은 빛을 내려면 주문을 정확히 외워야 해요.', 'Bal-geun bi-cheul nae-ryeo-myeon ju-mu-neul jeong-hwa-khi oe-wo-ya hae-yo.', 'Muốn tạo ánh sáng rực rỡ thì phải niệm đúng câu thần chú.'],
  ], 'magic'),
  ...buildPackLexicon('ko', 2, 'beginner', [
    ['x_bitjaru', '빗자루', 'bit-ja-ru', 'danh từ', 'chổi bay phép thuật', '신입생들이 운동장에서 빗자루 타는 법을 배워요.', 'Si-nip-saeng-deu-ri un-dong-jang-e-seo bit-ja-ru ta-neun beo-beul bae-wo-yo.', 'Học sinh năm nhất học cách cưỡi chổi bay ngoài sân cỏ.'],
    ['x_mabeopyak', '마법약', 'ma-beop-yak', 'danh từ', 'độc dược, thuốc phép', '은빛 가마솥에서 천천히 마법약을 저어요.', 'Eun-bit ga-ma-so-te-seo cheon-cheon-hi ma-beop-ya-geul jeo-eo-yo.', 'Khuấy đều bình độc dược trong chiếc vạc ánh bạc.'],
  ], 'magic'),
  ...buildPackLexicon('ko', 3, 'beginner', [
    ['x_mangto', '투명 망토', 'tu-myeong mang-to', 'danh từ', 'áo choàng tàng hình', '투명 망토를 두르면 밤 복도에서도 보이지 않아요.', 'Tu-myeong mang-to-reul du-reu-myeon bam bok-do-e-seo-do bo-i-ji a-na-yo.', 'Khoác áo choàng tàng hình lên là đi ngoài hành lang đêm cũng không ai thấy.'],
    ['x_seong', '성', 'seong', 'danh từ', 'lâu đài cổ kính', '호수 너머로 불빛이 반짝이는 마법 성이 보여요.', 'Ho-su neo-meo-ro bul-bi-chi ban-jja-gi-neun ma-beop seong-i bo-yeo-yo.', 'Bên kia mặt hồ hiện ra tòa lâu đài phép thuật lung linh ánh đèn.'],
  ], 'magic'),
  ...buildPackLexicon('ko', 4, 'intermediate', [
    ['x_suhoryeong', '수호령', 'su-ho-ryeong', 'danh từ', 'thần hộ mệnh', '가장 행복한 기억을 떠올리며 은빛 수호령을 불렀어요.', 'Ga-jang haeng-bo-khan gi-eo-geul tteo-ol-li-myeo eun-bit su-ho-ryeong-eul bul-leo-sseo-yo.', 'Nghĩ về ký ức hạnh phúc nhất để triệu hồi thần hộ mệnh ánh bạc.'],
    ['x_gisuksa', '기숙사', 'gi-suk-sa', 'danh từ', 'ký túc xá Nhà học viện', '우리 기숙사 휴게실에는 따뜻한 벽난로가 있어요.', 'U-ri gi-suk-sa hyu-ge-si-re-neun tta-tteu-than byeong-nal-lo-ga i-sseo-yo.', 'Phòng sinh hoạt chung ký túc xá Nhà chúng tôi có lò sưởi ấm áp.'],
  ], 'magic'),
  ...buildPackLexicon('ko', 5, 'intermediate', [
    ['x_yeeon', '예언', 'ye-eon', 'danh từ', 'lời tiên tri', '수정 구슬 속에 오래된 예언이 담겨 있었어요.', 'Su-jeong gu-seul so-ge o-rae-doen ye-eo-ni dam-gyeo i-sseo-sseo-yo.', 'Trong quả cầu pha lê chứa đựng một lời tiên tri cổ xưa.'],
    ['x_gyeoltu', '결투', 'gyeol-tu', 'danh từ', 'trận đấu tay đôi pháp thuật', '친선 결투 전에 두 학생이 정중하게 인사했어요.', 'Chin-seon gyeol-tu jeo-ne du hak-saeng-i jeong-jung-ha-ge in-sa-hae-sseo-yo.', 'Trước trận đấu tay đôi giao hữu hai học sinh cúi chào trang trọng.'],
  ], 'magic'),
  ...buildPackLexicon('ko', 6, 'intermediate', [
    ['x_yeongeumsul', '연금술', 'yeon-geum-sul', 'danh từ', 'thuật giả kim', '고대 학자들은 도서관 금지 구역에서 연금술을 연구했어요.', 'Go-dae hak-ja-deu-reun do-seo-gwan geum-ji gu-yeo-ge-seo yeon-geum-su-reul yeon-gu-hae-sseo-yo.', 'Các học giả cổ nghiên cứu thuật giả kim trong khu cấm của thư viện.'],
    ['x_gyojang', '교장', 'gyo-jang', 'danh từ', 'hiệu trưởng học viện', '지혜로운 교장 선생님이 개학 연회에서 축사를 하셨어요.', 'Ji-hye-ro-un gyo-jang seon-saeng-ni-mi gae-hak yeon-hoe-e-seo chuk-sa-reul ha-syeo-sseo-yo.', 'Thầy hiệu trưởng thông thái phát biểu chào mừng tại tiệc khai giảng.'],
  ], 'magic'),
  ...buildPackLexicon('ko', 7, 'intermediate', [
    ['x_bujeok', '부적', 'bu-jeok', 'danh từ', 'bùa hộ mệnh', '먼 여행길의 안전을 비는 은색 부적을 지니고 다녀요.', 'Meon yeo-haeng-gi-rui an-jeo-neul bi-neun eun-saek bu-jeo-geul ji-ni-go da-nyeo-yo.', 'Tôi mang theo lá bùa hộ mệnh bạc cầu bình an trên đường xa.'],
    ['x_mabeopseo', '마법서', 'ma-beop-seo', 'danh từ', 'sách thần chú cổ', '오래된 마법서 여백에 선배의 필기가 가득해요.', 'O-rae-doen ma-beop-seo yeo-bae-ge seon-bae-ui pil-gi-ga ga-deu-khae-yo.', 'Bên lề quyển sách thần chú cũ dày đặc ghi chú của đàn anh.'],
  ], 'magic'),
  ...buildPackLexicon('ko', 8, 'advanced', [
    ['x_byeonsinsul', '변신술', 'byeon-sin-sul', 'danh từ', 'môn biến hình pháp thuật', '변신술 수업에서는 높은 집중력과 정확성이 필수다.', 'Byeon-sin-sul su-eo-be-seo-neun no-peun jip-jung-nyeok-gwa jeong-hwak-seong-i pil-su-da.', 'Trong tiết Biến hình, độ tập trung cao và sự chuẩn xác là bắt buộc.'],
    ['x_yeongchang', '영창', 'yeong-chang', 'danh từ', 'câu niệm chú cổ ngữ', '단 한 글자의 영창 실수도 마법의 결과를 바꾼다.', 'Dan han geul-ja-ui yeong-chang sil-su-do ma-beo-bui gyeol-gwa-reul ba-kkun-da.', 'Chỉ sai một âm tiết khi niệm chú cũng làm đổi kết quả phép thuật.'],
  ], 'magic'),
  ...buildPackLexicon('ko', 9, 'advanced', [
    ['x_buyu', '공중 부양', 'gong-jung bu-yang', 'danh từ', 'bùa bay lơ lửng', '손목을 부드럽게 휘둘러 깃털 공중 부양에 성공했다.', 'Son-mo-geul bu-deu-reop-ge hwi-dul-leo git-teol gong-jung bu-yang-e seong-gong-haet-da.', 'Vẩy cổ tay nhẹ nhàng là làm chiếc lông vũ bay lơ lửng thành công.'],
    ['x_sungan', '순간 이동', 'sun-gan i-dong', 'danh từ', 'độn thổ, dịch chuyển tức thời', '순간 이동 면허를 따려면 까다로운 실기 시험을 통과해야 한다.', 'Sun-gan i-dong myeon-heo-reul tta-ryeo-myeon kka-da-ro-un sil-gi si-heo-meul tong-gwa-hae-ya han-da.', 'Muốn có bằng độn thổ phải vượt qua kỳ thi thực hành khắt khe.'],
  ], 'magic'),
  ...buildPackLexicon('ko', 10, 'advanced', [
    ['x_cheonrian', '천리안', 'cheon-ni-an', 'danh từ', 'nhãn thông, thấu thị tiên tri', '진정한 천리안은 찻잎만 들여다본다고 얻어지지 않는다.', 'Jin-jeong-han cheon-ni-a-neun chan-nim-man deu-ryeo-da-bon-da-go eo-deo-ji-ji an-neun-da.', 'Khả năng thấu thị chân chính không thể có chỉ nhờ nhìn lá trà.'],
    ['x_bisul', '비술', 'bi-sul', 'danh từ', 'bí thuật pháp sư cổ đại', '고대 연대기에는 성벽을 지키는 수호 비술이 기록되어 있다.', 'Go-dae yeon-dae-gi-e-neun seong-byeo-geul ji-ki-neun su-ho bi-su-ri gi-rok-doe-eo it-da.', 'Biên niên sử cổ ghi chép về bí thuật phòng hộ bảo vệ tường thành.'],
  ], 'magic'),
];

export const KO_EXPANDED_CURATED: CuratedQuizItem[] = [
  {
    id: 'ko_x_daily_dial_1',
    lang: 'ko',
    tier: 'beginner',
    levelBand: 2,
    topic: 'daily',
    format: 'dialogue_reply',
    promptVi: 'Bạn thân xin lỗi vì đến quán cà phê muộn — chọn lời đáp thân thiện nhất:',
    stemText: '친구: "미안해, 차가 너무 막혀서 조금 늦었어!"',
    stemPhonetic: 'Mi-an-hae, cha-ga neo-mu ma-khyeo-seo jo-geum neu-jeo-sseo!',
    fullSentence: '괜찮아, 나도 방금 도착했어!',
    fullPhonetic: 'Gwaen-cha-na, na-do bang-geum do-cha-khae-sseo!',
    translationVi: 'Không sao đâu, mình cũng vừa mới đến thôi!',
    choices: [
      '괜찮아, 나도 방금 도착했어!',
      '공항은 여기서 두 시간 걸려요.',
      '비밀번호를 꼭 변경하세요.',
      '내일은 수영장에 갈 거예요.',
    ],
    correctIndex: 0,
    grammarTitleVi: 'Đáp lại lời xin lỗi tự nhiên: 괜찮아 (Không sao đâu) + 방금 (vừa mới)',
    grammarExplainVi: 'Trạng từ "방금" (vừa mới tức thì) đi cùng quá khứ "-았/었어" tạo cảm giác nhẹ nhàng, giúp bạn đỡ ngại khi trễ hẹn.',
    vocabNotes: [
      { word: '방금', phonetic: 'bang-geum', posVi: 'phó từ', meaningVi: 'vừa mới' },
      { word: '도착하다', phonetic: 'do-cha-kha-da', posVi: 'động từ', meaningVi: 'đến nơi' },
    ],
  },
  {
    id: 'ko_x_travel_cloze_1',
    lang: 'ko',
    tier: 'intermediate',
    levelBand: 4,
    topic: 'travel',
    format: 'grammar_cloze',
    promptVi: 'Chọn cấu trúc hỏi đường lịch sự đến ga tàu điện ngầm:',
    stemText: '실례지만 가장 가까운 지하철역에 가려면 어느 쪽으로 ____?',
    stemPhonetic: 'Sil-lye-ji-man ga-jang ga-kka-un ji-ha-cheol-lyeo-ge ga-ryeo-myeon eo-neu jjo-geu-ro ____?',
    fullSentence: '실례지만 가장 가까운 지하철역에 가려면 어느 쪽으로 가야 해요?',
    fullPhonetic: 'Sil-lye-ji-man ga-jang ga-kka-un ji-ha-cheol-lyeo-ge ga-ryeo-myeon eo-neu jjo-geu-ro ga-ya hae-yo?',
    translationVi: 'Xin lỗi, muốn tới ga tàu điện ngầm gần nhất thì phải đi hướng nào ạ?',
    choices: ['가야 해요', '갔었어요', '갈 뻔했어요', '가고 싶었어요'],
    choicePhonetics: ['ga-ya hae-yo', 'ga-sseo-sseo-yo', 'gal ppeon-hae-sseo-yo', 'ga-go si-peo-sseo-yo'],
    correctIndex: 0,
    grammarTitleVi: 'Mẫu hỏi đường: -(으)려면 ... -아/어야 해요? (Muốn ... thì phải ...?)',
    grammarExplainVi: 'Vế trước "가려면" diễn tả mục đích (nếu muốn đi tới), đi cặp tự nhiên với "가야 해요?" (phải đi hướng nào?).',
    vocabNotes: [
      { word: '지하철역', phonetic: 'ji-ha-cheol-lyeok', posVi: 'danh từ', meaningVi: 'ga tàu điện ngầm' },
      { word: '어느 쪽', phonetic: 'eo-neu jjok', posVi: 'cụm từ', meaningVi: 'hướng nào, phía nào' },
    ],
  },
  {
    id: 'ko_x_tech_sent_1',
    lang: 'ko',
    tier: 'intermediate',
    levelBand: 5,
    topic: 'study_tech',
    format: 'sentence_builder',
    promptVi: 'Sắp xếp các thẻ từ để nói: "Chúng ta hãy hoàn thành bài thuyết trình trước hạn chót."',
    stemText: 'Chúng ta hãy hoàn thành bài thuyết trình trước hạn chót.',
    fullSentence: '마감 전에 발표 준비를 끝냅시다.',
    fullPhonetic: 'Ma-gam jeo-ne bal-pyo jun-bi-reul kkeut-naep-si-da.',
    translationVi: 'Chúng ta hãy hoàn thành khâu chuẩn bị thuyết trình trước hạn chót.',
    orderedTokens: ['마감', '전에', '발표', '준비를', '끝냅시다.'],
    distractorTokens: ['후에'],
    grammarTitleVi: 'Thời hạn N 전에 (trước khi) + đuôi rủ rê -(으)ㅂ시다',
    grammarExplainVi: 'Trong tiếng Hàn, danh từ thời điểm đứng trước "전에" (마감 전에 = trước hạn chót), động từ đề nghị "끝냅시다" đứng cuối câu.',
    vocabNotes: [
      { word: '마감', phonetic: 'ma-gam', posVi: 'danh từ', meaningVi: 'hạn chót' },
      { word: '발표', phonetic: 'bal-pyo', posVi: 'danh từ', meaningVi: 'bài thuyết trình' },
    ],
  },
  {
    id: 'ko_x_health_cloze_1',
    lang: 'ko',
    tier: 'intermediate',
    levelBand: 6,
    topic: 'health_hobby',
    format: 'grammar_cloze',
    promptVi: 'Chọn đuôi nối chỉ mục đích rèn thể lực:',
    stemText: '체력을 ____ 매일 아침 삼십 분씩 수영해요.',
    stemPhonetic: 'Che-ryeo-geul ____ mae-il a-chim sam-sip bun-ssik su-yeong-hae-yo.',
    fullSentence: '체력을 기르려고 매일 아침 삼십 분씩 수영해요.',
    fullPhonetic: 'Che-ryeo-geul gi-reu-ryeo-go mae-il a-chim sam-sip bun-ssik su-yeong-hae-yo.',
    translationVi: 'Để rèn luyện thể lực, mỗi sáng tôi bơi ba mươi phút.',
    choices: ['기르려고', '기르지만', '길렀는데', '기르더라도'],
    choicePhonetics: ['gi-reu-ryeo-go', 'gi-reu-ji-man', 'gil-leon-neun-de', 'gi-reu-deo-ra-do'],
    correctIndex: 0,
    grammarTitleVi: 'Đuôi chỉ ý định/mục đích: V-(으)려고 (để mà...)',
    grammarExplainVi: '"기르다" (nuôi dưỡng, rèn luyện thể lực) kết hợp "-(으)려고" thành "기르려고" diễn tả mục đích rõ ràng cho hành động bơi mỗi sáng.',
    vocabNotes: [
      { word: '체력', phonetic: 'che-ryeok', posVi: 'danh từ', meaningVi: 'thể lực' },
      { word: '수영하다', phonetic: 'su-yeong-ha-da', posVi: 'động từ', meaningVi: 'bơi lội' },
    ],
  },
  {
    id: 'ko_x_magic_cloze_1',
    lang: 'ko',
    tier: 'advanced',
    levelBand: 8,
    topic: 'magic',
    format: 'grammar_cloze',
    promptVi: 'Chọn cấu trúc cao cấp về môn Biến hình pháp thuật:',
    stemText: '변신술은 단순한 암기____ 깊은 집중력이 요구되는 학문이다.',
    stemPhonetic: 'Byeon-sin-su-reun dan-sun-han am-gi____ gi-peun jip-jung-nyeo-gi yo-gu-doe-neun hang-mu-ni-da.',
    fullSentence: '변신술은 단순한 암기라기보다 깊은 집중력이 요구되는 학문이다.',
    fullPhonetic: 'Byeon-sin-su-reun dan-sun-han am-gi-ra-gi-bo-da gi-peun jip-jung-nyeo-gi yo-gu-doe-neun hang-mu-ni-da.',
    translationVi: 'Biến hình thuật là bộ môn đòi hỏi sự tập trung sâu sắc hơn là chỉ học thuộc lòng đơn thuần.',
    choices: ['라기보다', '덕분에', '만큼이나', '뿐이므로'],
    choicePhonetics: ['ra-gi-bo-da', 'deok-bu-ne', 'man-keu-mi-na', 'ppu-ni-meu-ro'],
    correctIndex: 0,
    grammarTitleVi: 'Cấu trúc TOPIK 5–6: N(이)라기보다 (hơn là / không hẳn là ... mà là ...)',
    grammarExplainVi: '"N(이)라기보다" dùng để so sánh định nghĩa tinh tế: phủ nhận nhẹ vế trước và nhấn mạnh bản chất thực sự ở vế sau.',
    vocabNotes: [
      { word: '변신술', phonetic: 'byeon-sin-sul', posVi: 'danh từ', meaningVi: 'môn Biến hình' },
      { word: '집중력', phonetic: 'jip-jung-nyeok', posVi: 'danh từ', meaningVi: 'khả năng tập trung' },
    ],
  },
];
