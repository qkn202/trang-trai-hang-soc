import { CuratedQuizItem, QuizLexiconEntry } from '../languageQuizBank';
import { buildPackLexicon } from './packHelper';

// +100 từ vựng Tiếng Trung mở rộng (5 chủ đề × 20 từ: 36 Sơ cấp, 40 Trung cấp, 24 Cao cấp)
export const ZH_EXPANDED_LEXICON: QuizLexiconEntry[] = [
  // ==================== 1. GIAO TIẾP, CẢM XÚC & QUAN HỆ (daily — 20 từ) ====================
  ...buildPackLexicon('zh', 1, 'beginner', [
    ['x_pengyou', '朋友', 'péngyou', 'danh từ', 'bạn bè', '周末我和好朋友一起去看电影。', 'Zhōumò wǒ hé hǎo péngyou yìqǐ qù kàn diànyǐng.', 'Cuối tuần tôi đi xem phim cùng người bạn thân.'],
    ['x_weixiao', '微笑', 'wēixiào', 'danh từ/động từ', 'nụ cười hiền, mỉm cười', '温暖的微笑让人感到非常亲切。', 'Wēnnuǎn de wēixiào ràng rén gǎndào fēicháng qīnqiè.', 'Nụ cười ấm áp khiến mọi người cảm thấy vô cùng gần gũi.'],
    ['x_shengri', '生日', 'shēngrì', 'danh từ', 'ngày sinh nhật', '今晚我们为妹妹准备了生日惊喜。', 'Jīnwǎn wǒmen wèi mèimei zhǔnbèi le shēngrì jīngxǐ.', 'Tối nay chúng tôi chuẩn bị bất ngờ sinh nhật cho em gái.'],
  ], 'daily'),
  ...buildPackLexicon('zh', 2, 'beginner', [
    ['x_daoqian', '道歉', 'dàoqiàn', 'động từ', 'xin lỗi', '他因为迟到马上打电话道歉了。', 'Tā yīnwèi chídào mǎshàng dǎ diànhuà dàoqiàn le.', 'Anh ấy lập tức gọi điện xin lỗi vì đã đến muộn.'],
    ['x_xingfen', '兴奋', 'xīngfèn', 'tính từ', 'hào hứng, phấn khích', '大家想到明天的旅行都很兴奋。', 'Dàjiā xiǎngdào míngtiān de lǚxíng dōu hěn xīngfèn.', 'Mọi người nghĩ đến chuyến đi ngày mai đều rất hào hứng.'],
    ['x_yongbao', '拥抱', 'yōngbào', 'động từ/danh từ', 'ôm chầm, cái ôm', '在机场重逢时，她们紧紧地拥抱在一起。', 'Zài jīchǎng chóngféng shí, tāmen jǐnjǐn de yōngbào zài yìqǐ.', 'Lúc hội ngộ ở sân bay, họ ôm chầm lấy nhau thật chặt.'],
  ], 'daily'),
  ...buildPackLexicon('zh', 3, 'beginner', [
    ['x_chengshi', '诚实', 'chéngshí', 'tính từ', 'trung thực, thành thật', '感谢你今天给我这么诚实的建议。', 'Gǎnxiè nǐ jīntiān gěi wǒ zhème chéngshí de jiànyì.', 'Cảm ơn bạn hôm nay đã cho tôi lời khuyên chân thành như vậy.'],
    ['x_gudu', '孤独', 'gūdú', 'tính từ', 'cô đơn, lẻ loi', '一个人在外地生活有时会觉得孤独。', 'Yí ge rén zài wàidì shēnghuó yǒushí huì juéde gūdú.', 'Sống một mình nơi xa đôi lúc cũng cảm thấy cô đơn.'],
  ], 'daily'),
  ...buildPackLexicon('zh', 4, 'intermediate', [
    ['x_guli', '鼓励', 'gǔlì', 'động từ/danh từ', 'khích lệ, động viên', '好队友总是在低谷时互相鼓励。', 'Hǎo duìyǒu zǒngshì zài dīgǔ shí hùxiāng gǔlì.', 'Đồng đội tốt luôn khích lệ lẫn nhau lúc khó khăn.'],
    ['x_ganga', '尴尬', 'gāngà', 'tính từ', 'ngượng ngùng, lúng túng', '忘记同学名字的时候我有点尴尬。', 'Wàngjì tóngxué míngzi de shíhou wǒ yǒudiǎn gāngà.', 'Lúc lỡ quên tên bạn cùng lớp tôi thấy hơi ngượng ngùng.'],
  ], 'daily'),
  ...buildPackLexicon('zh', 5, 'intermediate', [
    ['x_wuhui', '误会', 'wùhuì', 'danh từ/động từ', 'sự hiểu lầm, hiểu nhầm', '面对面好好沟通后，误会很快就消除了。', 'Miànduìmiàn hǎohǎo gōutōng hòu, wùhuì hěn kuài jiù xiāochú le.', 'Sau khi trò chuyện thẳng thắn, hiểu lầm nhanh chóng tan biến.'],
    ['x_kekao', '可靠', 'kěkào', 'tính từ', 'đáng tin cậy', '小王做事踏实可靠，大家都信任他。', 'Xiǎo Wáng zuòshì tāshi kěkào, dàjiā dōu xìnrèn tā.', 'Tiểu Vương làm việc chắc chắn đáng tin nên ai cũng tín nhiệm.'],
  ], 'daily'),
  ...buildPackLexicon('zh', 6, 'intermediate', [
    ['x_tuoxie', '妥协', 'tuǒxié', 'động từ', 'thỏa hiệp, nhượng bộ', '双方各退一步，达成了公平的妥协。', 'Shuāngfāng gè tuì yí bù, dáchéng le gōngpíng de tuǒxié.', 'Hai bên cùng lùi một bước để đạt thỏa hiệp công bằng.'],
    ['x_zhenxi', '珍惜', 'zhēnxī', 'động từ', 'trân trọng, gìn giữ', '我们应该珍惜和家人相聚的每一刻。', 'Wǒmen yīnggāi zhēnxī hé jiārén xiāngjù de měi yí kè.', 'Chúng ta nên trân trọng từng khoảnh khắc sum họp bên gia đình.'],
  ], 'daily'),
  ...buildPackLexicon('zh', 7, 'intermediate', [
    ['x_tongqing', '同情', 'tóngqíng', 'danh từ/động từ', 'sự cảm thông, đồng cảm', '她怀着深切的同情倾听朋友倾诉烦恼。', 'Tā huáizhe shēnqiè de tóngqíng qīngtīng péngyou qīngsù fánnǎo.', 'Cô ấy lắng nghe bạn tâm sự với sự cảm thông sâu sắc.'],
    ['x_xinren', '信任', 'xìnrèn', 'danh từ/động từ', 'sự tin tưởng, tín nhiệm', '真诚和守信是建立长久信任的基石。', 'Zhēnchéng hé shǒuxìn shì jiànlì chángjiǔ xìnrèn de jīshí.', 'Chân thành và giữ chữ tín là nền tảng của niềm tin bền lâu.'],
  ], 'daily'),
  ...buildPackLexicon('zh', 8, 'advanced', [
    ['x_gongqing', '共情', 'gòngqíng', 'danh từ/động từ', 'sự thấu cảm sâu sắc', '真正的共情能让我们站在他人的角度看世界。', 'Zhēnzhèng de gòngqíng néng ràng wǒmen zhàn zài tārén de jiǎodù kàn shìjiè.', 'Thấu cảm thực sự giúp ta nhìn thế giới từ góc nhìn người khác.'],
    ['x_hejie', '和解', 'héjiě', 'động từ', 'hòa giải, làm lành', '多年之后，两位昔日的对手终于握手和解。', 'Duōnián zhīhòu, liǎng wèi xīrì de duìshǒu zhōngyú wòshǒu héjiě.', 'Nhiều năm sau, hai đối thủ xưa cuối cùng đã bắt tay hòa giải.'],
  ], 'daily'),
  ...buildPackLexicon('zh', 9, 'advanced', [
    ['x_xiongbian', '雄辩', 'xióngbiàn', 'tính từ/danh từ', 'hùng biện, ăn nói sắc sảo', '她雄辩的演讲深深打动了礼堂里的听众。', 'Tā xióngbiàn de yǎnjiǎng shēnshēn dǎdòng le lǐtáng lǐ de tīngzhòng.', 'Bài diễn thuyết hùng hồn của cô đã lay động cả khán phòng.'],
  ], 'daily'),
  ...buildPackLexicon('zh', 10, 'advanced', [
    ['x_qingyi', '情谊', 'qíngyì', 'danh từ', 'tình nghĩa sâu đậm, tình đồng đội', '共同经历风雨让伙伴们结下了深厚的情谊。', 'Gòngtóng jīnglì fēngyǔ ràng huǒbànmen jiéxià le shēnhòu de qíngyì.', 'Cùng trải qua gian khó khiến các đồng đội gắn kết tình nghĩa sâu đậm.'],
  ], 'daily'),

  // ==================== 2. DU LỊCH, ĂN UỐNG, MUA SẮM & THÀNH PHỐ (travel — 20 từ) ====================
  ...buildPackLexicon('zh', 1, 'beginner', [
    ['x_huzhao', '护照', 'hùzhào', 'danh từ', 'hộ chiếu', '出国旅行时一定要随身带好护照。', 'Chūguó lǚxíng shí yídìng yào suíshēn dàihǎo hùzhào.', 'Khi đi du lịch nước ngoài nhất định phải mang theo hộ chiếu bên mình.'],
    ['x_jichang', '机场', 'jīchǎng', 'danh từ', 'sân bay', '我们提前两个小时到达了国际机场。', 'Wǒmen tíqián liǎng ge xiǎoshí dàodá le guójì jīchǎng.', 'Chúng tôi đã đến sân bay quốc tế sớm hai tiếng.'],
    ['x_chepiao', '车票', 'chēpiào', 'danh từ', 'vé tàu xe', '请把高铁车票准备好，马上就要检票了。', 'Qǐng bǎ gāotiě chēpiào zhǔnbèi hǎo, mǎshàng jiù yào jiǎnpiào le.', 'Xin chuẩn bị sẵn vé tàu cao tốc, sắp soát vé rồi.'],
  ], 'travel'),
  ...buildPackLexicon('zh', 2, 'beginner', [
    ['x_jiudian', '酒店', 'jiǔdiàn', 'danh từ', 'khách sạn', '这家海边酒店的阳台正对着蓝色海湾。', 'Zhè jiā hǎibiān jiǔdiàn de yángtái zhèngduìzhe lánsè hǎiwān.', 'Ban công khách sạn ven biển này nhìn thẳng ra vịnh xanh.'],
    ['x_caidan', '菜单', 'càidān', 'danh từ', 'thực đơn', '服务员，请给我看一下今晚的菜单。', 'Fúwùyuán, qǐng gěi wǒ kàn yíxià jīnwǎn de càidān.', 'Phục vụ ơi, cho tôi xem thực đơn tối nay với.'],
    ['x_shouju', '收据', 'shōujù', 'danh từ', 'hóa đơn thanh toán', '请保留收据，方便七天内退换衣服。', 'Qǐng bǎoliú shōujù, fāngbiàn qī tiān nèi tuìhuàn yīfu.', 'Vui lòng giữ hóa đơn để tiện đổi trả áo trong bảy ngày.'],
  ], 'travel'),
  ...buildPackLexicon('zh', 3, 'beginner', [
    ['x_ditie', '地铁', 'dìtiě', 'danh từ', 'tàu điện ngầm', '高峰时间坐地铁比开车快得多。', 'Gāofēng shíjiān zuò dìtiě bǐ kāichē kuài de duō.', 'Giờ cao điểm đi tàu điện ngầm nhanh hơn lái xe nhiều.'],
    ['x_ditu', '地图', 'dìtú', 'danh từ', 'bản đồ', '先看看城市地图，再决定从哪个出口出去。', 'Xiān kànkan chéngshì dìtú, zài juédìng cóng nǎge chūkǒu chūqù.', 'Xem bản đồ thành phố trước rồi quyết định ra ở cổng nào.'],
  ], 'travel'),
  ...buildPackLexicon('zh', 4, 'intermediate', [
    ['x_xingli', '行李', 'xíngli', 'danh từ', 'hành lý', '旅客们正在三号传送带旁领取行李。', 'Lǚkèmen zhèngzài sān hào chuánsòngdài páng lǐngqǔ xíngli.', 'Hành khách đang nhận hành lý bên băng chuyền số ba.'],
    ['x_yuding', '预订', 'yùdìng', 'động từ', 'đặt chỗ trước', '我已经提前预订了今晚七点的四人餐桌。', 'Wǒ yǐjīng tíqián yùdìng le jīnwǎn qī diǎn de sì rén cānzhuō.', 'Tôi đã đặt trước bàn cho bốn người vào bảy giờ tối nay.'],
  ], 'travel'),
  ...buildPackLexicon('zh', 5, 'intermediate', [
    ['x_chufa', '出发', 'chūfā', 'động từ', 'khởi hành, xuất phát', '我们的航班十分钟后开始登机出发。', 'Wǒmen de hángbān shí fēnzhōng hòu kāishǐ dēngjī chūfā.', 'Chuyến bay của chúng ta sẽ bắt đầu lên máy bay sau mười phút nữa.'],
    ['x_jinianpin', '纪念品', 'jìniànpǐn', 'danh từ', 'quà lưu niệm', '她在古镇买了一盏手工灯笼作为纪念品。', 'Tā zài gǔzhèn mǎi le yì zhǎn shǒugōng dēnglong zuòwéi jìniànpǐn.', 'Cô ấy mua một chiếc đèn lồng thủ công làm quà lưu niệm ở phố cổ.'],
  ], 'travel'),
  ...buildPackLexicon('zh', 6, 'intermediate', [
    ['x_xingcheng', '行程', 'xíngchéng', 'danh từ', 'lịch trình du lịch', '这五天的旅游行程安排得既轻松又充实。', 'Zhè wǔ tiān de lǚyóu xíngchéng ānpái de jì qīngsōng yòu chōngshí.', 'Lịch trình du lịch năm ngày này vừa thư thái vừa đầy trải nghiệm.'],
    ['x_zhekou', '折扣', 'zhékòu', 'danh từ', 'mức giảm giá', '凭学生证在这家书店可以享受八折折扣。', 'Píng xuéshengzhèng zài zhè jiā shūdiàn kěyǐ xiǎngshòu bā zhé zhékòu.', 'Xuất trình thẻ học sinh tại hiệu sách này được giảm 20%.'],
  ], 'travel'),
  ...buildPackLexicon('zh', 7, 'intermediate', [
    ['x_lukou', '十字路口', 'shízì lùkǒu', 'danh từ', 'ngã tư giao lộ', '过了前面第二个十字路口向右转就是车站。', 'Guò le qiánmiàn dì-èr ge shízì lùkǒu xiàng yòu zhuǎn jiù shì chēzhàn.', 'Qua ngã tư thứ hai phía trước rồi rẽ phải là tới nhà ga.'],
    ['x_huobi', '货币', 'huòbì', 'danh từ', 'tiền tệ, ngoại tệ', '出行前记得先在银行兑换当地货币。', 'Chūxíng qián jìde xiān zài yínháng duìhuàn dāngdì huòbì.', 'Trước khi đi nhớ đổi sang tiền tệ địa phương tại ngân hàng.'],
  ], 'travel'),
  ...buildPackLexicon('zh', 8, 'advanced', [
    ['x_duoyuan', '国际化', 'guójìhuà', 'tính từ/danh từ', 'mang tầm quốc tế, đa văn hóa', '这是一座充满活力、极具国际化气息的大都市。', 'Zhè shì yí zuò chōngmǎn huólì, jí jù guójìhuà qìxī de dà dūshì.', 'Đây là một đại đô thị tràn đầy sức sống và đậm nét quốc tế.'],
    ['x_haoke', '好客', 'hàokè', 'tính từ', 'hiếu khách, nồng hậu', '海岛居民热情好客的待客之道令游客难忘。', 'Hǎidǎo jūmín rèqíng hàokè de dàikè zhī dào lìng yóukè nánwàng.', 'Lòng hiếu khách nồng hậu của người dân đảo khiến du khách khó quên.'],
  ], 'travel'),
  ...buildPackLexicon('zh', 9, 'advanced', [
    ['x_tanfang', '探访', 'tànfǎng', 'động từ', 'thăm thú, khám phá sâu', '我们乘船探访了隐藏在碧海之间的古老溶洞。', 'Wǒmen chéngchuán tànfǎng le yǐncáng zài bìhǎi zhījiān de gǔlǎo róngdòng.', 'Chúng tôi đi thuyền khám phá hang động cổ ẩn giữa vịnh biển xanh.'],
  ], 'travel'),
  ...buildPackLexicon('zh', 10, 'advanced', [
    ['x_lutu', '旅途', 'lǚtú', 'danh từ', 'chặng đường lữ hành', '漫长而精彩的旅途开阔了她的眼界与胸怀。', 'Màncháng ér jīngcǎi de lǚtú kāikuò le tā de yǎnjiè yǔ xiōnghuái.', 'Hành trình dài đầy thú vị đã mở rộng tầm mắt và tâm hồn cô ấy.'],
  ], 'travel'),

  // ==================== 3. HỌC TẬP, CÔNG VIỆC & CÔNG NGHỆ (study_tech — 20 từ) ====================
  ...buildPackLexicon('zh', 1, 'beginner', [
    ['x_bijiben', '笔记本', 'bǐjìběn', 'danh từ', 'vở ghi chép / máy tính xách tay', '我把每天学到的新词都写在笔记本里。', 'Wǒ bǎ měitiān xuédào de xīncí dōu xiě zài bǐjìběn lǐ.', 'Tôi chép mọi từ mới học mỗi ngày vào quyển sổ tay.'],
    ['x_tushuguan', '图书馆', 'túshūguǎn', 'danh từ', 'thư viện', '放学后很多同学喜欢在图书馆安静地自习。', 'Fàngxué hòu hěn duō tóngxué xǐhuan zài túshūguǎn ānjìng de zìxí.', 'Sau giờ tan học nhiều bạn thích tự học yên tĩnh ở thư viện.'],
    ['x_xiaoxi', '消息', 'xiāoxi', 'danh từ', 'tin nhắn, tin tức', '到家之后记得给我发一条消息报平安。', 'Dàojiā zhīhòu jìde gěi wǒ fā yì tiáo xiāoxi bào píng’ān.', 'Về đến nhà nhớ gửi cho mình một tin nhắn báo bình an nhé.'],
  ], 'study_tech'),
  ...buildPackLexicon('zh', 2, 'beginner', [
    ['x_jianpan', '键盘', 'jiànpán', 'danh từ', 'bàn phím', '这款轻巧的无线键盘打字非常顺手。', 'Zhè kuǎn qīngqiǎo de wúxiàn jiànpán dǎzì fēicháng shùnshǒu.', 'Chiếc bàn phím không dây gọn nhẹ này gõ rất êm tay.'],
    ['x_mima', '密码', 'mìmǎ', 'danh từ', 'mật khẩu', '千万不要把账户密码告诉网上的陌生人。', 'Qiānwàn búyào bǎ zhànghù mìmǎ gàosu wǎngshàng de mòshēngrén.', 'Tuyệt đối đừng tiết lộ mật khẩu tài khoản cho người lạ trên mạng.'],
  ], 'study_tech'),
  ...buildPackLexicon('zh', 3, 'beginner', [
    ['x_zuoye', '作业', 'zuòyè', 'danh từ', 'bài tập về nhà', '先把今天的数学作业写完再去玩游戏。', 'Xiān bǎ jīntiān de shùxué zuòyè xiěwán zài qù wán yóuxì.', 'Làm xong bài tập toán hôm nay rồi hãy đi chơi game nhé.'],
    ['x_huiyi', '会议', 'huìyì', 'danh từ', 'cuộc họp', '团队早会每天上午九点准时开始。', 'Tuánduì zǎohuì měitiān shàngwǔ jiǔ diǎn zhǔnshí kāishǐ.', 'Cuộc họp sáng của nhóm bắt đầu đúng chín giờ mỗi ngày.'],
  ], 'study_tech'),
  ...buildPackLexicon('zh', 4, 'intermediate', [
    ['x_jiezhi', '截止日期', 'jiézhǐ rìqī', 'danh từ', 'hạn chót nộp bài', '设计组在截止日期前顺利提交了完整报告。', 'Shèjìzǔ zài jiézhǐ rìqī qián shùnlì tíjiāo le wánzhěng bàogào.', 'Nhóm thiết kế đã nộp trọn vẹn báo cáo trước hạn chót.'],
    ['x_tongshi', '同事', 'tóngshì', 'danh từ', 'đồng nghiệp', '热心的同事教了我一个高效的表格快捷键。', 'Rèxīn de tóngshì jiāo le wǒ yí ge gāoxiào de biǎogé kuàijiéjiàn.', 'Người đồng nghiệp nhiệt tình đã chỉ tôi phím tắt bảng tính rất nhanh.'],
  ], 'study_tech'),
  ...buildPackLexicon('zh', 5, 'intermediate', [
    ['x_jiangxuejin', '奖学金', 'jiǎngxuéjīn', 'danh từ', 'học bổng', '凭借优异的成绩，她获得了大学全额奖学金。', 'Píngjiè yōuyì de chéngjì, tā huòdé le dàxué quán’é jiǎngxuéjīn.', 'Nhờ thành tích xuất sắc, cô nhận được học bổng đại học toàn phần.'],
    ['x_tongzhi', '通知', 'tōngzhī', 'danh từ', 'thông báo ứng dụng', '备考复习时最好先把手机通知关掉。', 'Bèikǎo fùxí shí zuìhǎo xiān bǎ shǒujī tōngzhī guāndiào.', 'Khi ôn thi tốt nhất hãy tắt thông báo điện thoại trước.'],
  ], 'study_tech'),
  ...buildPackLexicon('zh', 6, 'intermediate', [
    ['x_yanjiang', '演示汇报', 'yǎnshì huìbào', 'danh từ', 'bài thuyết trình trình chiếu', '研讨会开始前他把演示汇报排练了两遍。', 'Yántǎohuì kāishǐ qián tā bǎ yǎnshì huìbào páiliàn le liǎng biàn.', 'Trước buổi hội thảo anh ấy tập dượt bài thuyết trình hai lần.'],
    ['x_fankui', '反馈', 'fǎnkuì', 'danh từ/động từ', 'phản hồi, góp ý', '真诚的反馈能帮助作者不断打磨作品。', 'Zhēnchéng de fǎnkuì néng bāngzhù zuòzhě búduàn dǎmó zuòpǐn.', 'Phản hồi chân thành giúp tác giả không ngừng trau chuốt tác phẩm.'],
  ], 'study_tech'),
  ...buildPackLexicon('zh', 7, 'intermediate', [
    ['x_suanfa', '算法', 'suànfǎ', 'danh từ', 'thuật toán', '智能搜索算法能迅速找到最准确的答案。', 'Zhìnéng sōusuǒ suànfǎ néng xùnsù zhǎodào zuì zhǔnquè de dá’àn.', 'Thuật toán tìm kiếm thông minh tìm rất nhanh đáp án chính xác nhất.'],
    ['x_yingyong', '应用程序', 'yìngyòng chéngxù', 'danh từ', 'ứng dụng phần mềm', '这款外语应用程序会记录你每天的复习进度。', 'Zhè kuǎn wàiyǔ yìngyòng chéngxù huì jìlù nǐ měitiān de fùxí jìndù.', 'Ứng dụng ngoại ngữ này ghi lại tiến độ ôn tập mỗi ngày của bạn.'],
  ], 'study_tech'),
  ...buildPackLexicon('zh', 8, 'advanced', [
    ['x_chuangxin', '创新', 'chuàngxīn', 'danh từ/động từ', 'sự đổi mới sáng tạo', '清洁能源技术创新正在深刻改变现代城市生活。', 'Qīngjié néngyuán jìshù chuàngxīn zhèngzài shēnkè gǎibiàn xiàndài chéngshì shēnghuó.', 'Đổi mới công nghệ năng lượng sạch đang thay đổi sâu sắc đời sống đô thị.'],
    ['x_jiami', '加密', 'jiāmì', 'động từ/danh từ', 'mã hóa bảo mật', '高强度加密技术可以有效保护个人隐私数据。', 'Gāo qiángdù jiāmì jìshù kěyǐ yǒuxiào bǎohù gèrén yǐnsī shùjù.', 'Công nghệ mã hóa mạnh giúp bảo vệ hiệu quả dữ liệu riêng tư.'],
  ], 'study_tech'),
  ...buildPackLexicon('zh', 9, 'advanced', [
    ['x_shulian', '熟练度', 'shúliàndù', 'danh từ', 'mức độ thành thạo', '每天坚持口语练习能够显著提升外语熟练度。', 'Měitiān jiānchí kǒuyǔ liànxí nénggòu xiǎnzhù tíshēng wàiyǔ shúliàndù.', 'Kiên trì luyện nói mỗi ngày nâng cao rõ rệt mức độ thành thạo ngoại ngữ.'],
    ['x_zidonghua', '自动化', 'zìdònghuà', 'danh từ', 'tự động hóa', '流程自动化为工程师节省了大量重复测试时间。', 'Liúchéng zìdònghuà wèi gōngchéngshī jiéshěng le dàliàng chóngfù cèshì shíjiān.', 'Tự động hóa quy trình tiết kiệm cho kỹ sư rất nhiều giờ kiểm thử lặp lại.'],
  ], 'study_tech'),
  ...buildPackLexicon('zh', 10, 'advanced', [
    ['x_fanshi', '范式', 'fànshì', 'danh từ', 'mô hình chuẩn, hệ tư duy mới', '人工智能的突破开启了全新的科学计算范式。', 'Réngōng zhìnéng de tūpò kāiqǐ le quánxīn de kēxué jìsuàn fànshì.', 'Bước đột phá AI đã mở ra mô hình tính toán khoa học hoàn toàn mới.'],
  ], 'study_tech'),

  // ==================== 4. SỨC KHỎE, THỂ THAO, ÂM NHẠC & GIẢI TRÍ (health_hobby — 20 từ) ====================
  ...buildPackLexicon('zh', 1, 'beginner', [
    ['x_yiyuan', '医院', 'yīyuàn', 'danh từ', 'bệnh viện', '市中心医院全天二十四小时提供急诊服务。', 'Shìzhōngxīn yīyuàn quántiān èrshísì xiǎoshí tígōng jízhěn fúwù.', 'Bệnh viện trung tâm thành phố trực cấp cứu suốt 24 giờ mỗi ngày.'],
    ['x_fashao', '发烧', 'fāshāo', 'động từ', 'bị sốt', '发烧的时候要多喝温水，好好休息。', 'Fāshāo de shíhou yào duō hē wēnshuǐ, hǎohǎo xiūxi.', 'Lúc bị sốt cần uống nhiều nước ấm và nghỉ ngơi đầy đủ.'],
    ['x_jita', '吉他', 'jítā', 'danh từ', 'đàn ghi-ta', '夏天露营时，他常在篝火旁弹木吉他。', 'Xiàtiān lùyíng shí, tā cháng zài gōuhuǒ páng tán mù jítā.', 'Mỗi dịp cắm trại mùa hè, cậu ấy hay chơi đàn ghi-ta bên lửa trại.'],
  ], 'health_hobby'),
  ...buildPackLexicon('zh', 2, 'beginner', [
    ['x_yaopin', '药物', 'yàowù', 'danh từ', 'thuốc chữa bệnh', '请按照医生的嘱咐在饭后按时服用药物。', 'Qǐng ànzhào yīshēng de zhǔfù zài fànhòu ànshí fúyòng yàowù.', 'Hãy uống thuốc đúng giờ sau bữa ăn theo dặn dò của bác sĩ.'],
    ['x_yinyuehui', '音乐会', 'yīnyuèhuì', 'danh từ', 'buổi hòa nhạc', '这场交响乐音乐会的门票十分钟就被抢光了。', 'Zhè chǎng jiāoxiǎngyuè yīnyuèhuì de ménpiào shí fēnzhōng jiù bèi qiǎngguāng le.', 'Vé buổi hòa nhạc giao hưởng này hết sạch chỉ trong mười phút.'],
  ], 'health_hobby'),
  ...buildPackLexicon('zh', 3, 'beginner', [
    ['x_youyong', '游泳', 'yóuyǒng', 'động từ/danh từ', 'bơi lội', '早晨去游泳能让我一整天精力充沛。', 'Zǎochén qù yóuyǒng néng ràng wǒ yì zhěng tiān jīnglì chōngpèi.', 'Đi bơi buổi sáng giúp tôi tràn đầy năng lượng cả ngày.'],
    ['x_xiangji', '相机', 'xiàngjī', 'danh từ', 'máy ảnh', '她带着复古胶片相机记录街头温暖瞬间。', 'Tā dàizhe fùgǔ jiāopiàn xiàngjī jìlù jiētóu wēnnuǎn shùnjiān.', 'Cô ấy mang theo máy ảnh phim cổ ghi lại khoảnh khắc ấm áp phố phường.'],
  ], 'health_hobby'),
  ...buildPackLexicon('zh', 4, 'intermediate', [
    ['x_yingyang', '营养', 'yíngyǎng', 'danh từ', 'dinh dưỡng', '均衡的营养和充足睡眠能显著提高专注力。', 'Jūnhéng de yíngyǎng hé chōngzú shuìmián néng xiǎnzhù tígāo zhuānzhùlì.', 'Dinh dưỡng cân bằng và ngủ đủ giấc nâng cao sự tập trung rõ rệt.'],
    ['x_xuanlv', '旋律', 'xuánlǜ', 'danh từ', 'giai điệu', '那段轻柔的钢琴旋律在我脑海里回荡了一整天。', 'Nà duàn qīngróu de gāngqín xuánlǜ zài wǒ nǎohǎi lǐ huídàng le yì zhěng tiān.', 'Đoạn giai điệu piano dịu êm ấy cứ vang mãi trong đầu tôi cả ngày.'],
  ], 'health_hobby'),
  ...buildPackLexicon('zh', 5, 'intermediate', [
    ['x_naili', '耐力', 'nàilì', 'danh từ', 'sức bền, độ dẻo dai', '坚持长跑训练可以循序渐进地增强耐力。', 'Jiānchí chángpǎo xùnliàn kěyǐ xúnxù jiànjìn de zēngqiáng nàilì.', 'Kiên trì tập chạy đường dài giúp tăng sức bền từng bước một.'],
    ['x_daoyan', '导演', 'dǎoyǎn', 'danh từ', 'đạo diễn', '这位电影导演凭借细腻的镜头荣获国际大奖。', 'Zhè wèi diànyǐng dǎoyǎn píngjiè xìnì de jìngtóu rónghuò guójì dàjiǎng.', 'Vị đạo diễn phim này đoạt giải lớn quốc tế nhờ góc quay tinh tế.'],
  ], 'health_hobby'),
  ...buildPackLexicon('zh', 6, 'intermediate', [
    ['x_chufang', '处方', 'chǔfāng', 'danh từ', 'đơn thuốc của bác sĩ', '请带上医生的处方到街角药房取药。', 'Qǐng dàishàng yīshēng de chǔfāng dào jiējiǎo yàofáng qǔyào.', 'Hãy mang đơn thuốc của bác sĩ tới hiệu thuốc ở góc phố lấy thuốc.'],
    ['x_zhanlan', '展览', 'zhǎnlǎn', 'danh từ', 'buổi triển lãm', '现代艺术展览将于本周六上午正式开幕。', 'Xiàndài yìshù zhǎnlǎn jiāng yú běn zhōuliù shàngwǔ zhèngshì kāimù.', 'Triển lãm nghệ thuật đương đại sẽ chính thức khai mạc sáng thứ Bảy này.'],
  ], 'health_hobby'),
  ...buildPackLexicon('zh', 7, 'intermediate', [
    ['x_malasong', '马拉松', 'mǎlāsōng', 'danh từ', 'cuộc chạy ma-ra-tông', '她苦练半年，终于完成了人生第一场马拉松。', 'Tā kǔliàn bànnián, zhōngyú wánchéng le rénshēng dì-yī chǎng mǎlāsōng.', 'Cô khổ luyện nửa năm và đã hoàn thành giải ma-ra-tông đầu đời.'],
    ['x_mingxiang', '冥想', 'míngxiǎng', 'động từ/danh từ', 'thiền định, tĩnh tâm', '每天清晨十分钟冥想让浮躁的心情渐渐平静。', 'Měitiān qīngchén shí fēnzhōng míngxiǎng ràng fúzào de xīnqíng jiànjiàn píngjìng.', 'Mười phút thiền mỗi sáng giúp tâm trạng xao động dần lắng dịu.'],
  ], 'health_hobby'),
  ...buildPackLexicon('zh', 8, 'advanced', [
    ['x_mianyi', '免疫力', 'miǎnyìlì', 'danh từ', 'hệ miễn dịch, sức đề kháng', '规律的户外运动有助于提升人体自然免疫力。', 'Guīlǜ de hùwài yùndòng yǒuzhùyú tíshēng réntǐ zìrán miǎnyìlì.', 'Vận động ngoài trời điều độ giúp tăng cường miễn dịch tự nhiên.'],
    ['x_jiezuo', '杰作', 'jiézuò', 'danh từ', 'kiệt tác nghệ thuật', '影评界将这部动画电影誉为跨越时代的杰作。', 'Yǐngpíngjiè jiāng zhè bù dònghuà diànyǐng yùwéi kuàyuè shídài de jiézuò.', 'Giới phê bình ca ngợi bộ phim hoạt hình là kiệt tác vượt thời đại.'],
  ], 'health_hobby'),
  ...buildPackLexicon('zh', 9, 'advanced', [
    ['x_bianwu', '编舞', 'biānwǔ', 'danh từ/động từ', 'biên đạo múa, dàn dựng vũ đạo', '行云流水的舞台编舞令全场观众赞叹不已。', 'Xíngyún liúshuǐ de wǔtái biānwǔ lìng quánchǎng guānzhòng zàntàn bùyǐ.', 'Phần biên đạo sân khấu uyển chuyển khiến cả khán đài trầm trồ.'],
    ['x_kangfu', '康复', 'kāngfù', 'động từ/danh từ', 'phục hồi sức khỏe/chức năng', '经过科学系统的康复训练，运动员重返赛场。', 'Jīngguò kēxué xìtǒng de kāngfù xùnliàn, yùndòngyuán chóngfǎn sàichǎng.', 'Sau quá trình phục hồi bài bản, vận động viên đã trở lại đấu trường.'],
  ], 'health_hobby'),
  ...buildPackLexicon('zh', 10, 'advanced', [
    ['x_shuhuai', '释怀', 'shìhuái', 'động từ', 'giải tỏa cảm xúc, nhẹ lòng buông bỏ', '动人的大结局让许多观众在泪光中彻底释怀。', 'Dòngrén de dàjiéjú ràng xǔduō guānzhòng zài lèiguāng zhōng chèdǐ shìhuái.', 'Đoạn kết xúc động giúp nhiều khán giả nhẹ lòng giải tỏa trong nước mắt.'],
  ], 'health_hobby'),

  // ==================== 5. THẾ GIỚI HARRY POTTER & PHÉP THUẬT (magic — 20 từ) ====================
  ...buildPackLexicon('zh', 1, 'beginner', [
    ['x_mozhang', '魔杖', 'mózhàng', 'danh từ', 'đũa phép', '每位年轻巫师都知道，是魔杖选择了它的主人。', 'Měi wèi niánqīng wūshī dōu zhīdào, shì mózhàng xuǎnzé le tā de zhǔrén.', 'Mọi phù thủy trẻ đều biết rằng chính đũa phép chọn chủ nhân của nó.'],
    ['x_zhouyu', '咒语', 'zhòuyǔ', 'danh từ', 'thần chú, câu bùa', '念照明咒语时必须把每个音节发清楚。', 'Niàn zhàomíng zhòuyǔ shí bìxū bǎ měi ge yīnjié fā qīngchu.', 'Khi niệm thần chú phát sáng phải phát âm rõ từng âm tiết.'],
  ], 'magic'),
  ...buildPackLexicon('zh', 2, 'beginner', [
    ['x_saoba', '飞天扫帚', 'fēitiān sàozhou', 'danh từ', 'chổi bay phép thuật', '一年级新生在草坪上练习驾驭飞天扫帚。', 'Yī niánjí xīnshēng zài cǎopíng shàng liànxí jiàyù fēitiān sàozhou.', 'Học sinh năm nhất tập điều khiển chổi bay trên bãi cỏ.'],
    ['x_moyao', '魔药', 'móyào', 'danh từ', 'độc dược, thuốc phép', '把银色坩埚里的魔药逆时针轻轻搅拌三圈。', 'Bǎ yínsè gānguō lǐ de móyào nìshízhēn qīngqīng jiǎobàn sān quān.', 'Khuấy nhẹ bình độc dược trong vạc bạc ba vòng ngược chiều kim đồng hồ.'],
  ], 'magic'),
  ...buildPackLexicon('zh', 3, 'beginner', [
    ['x_doupeng', '隐形斗篷', 'yǐnxíng dǒupéng', 'danh từ', 'áo choàng tàng hình', '披上隐形斗篷后，夜里走在走廊也不会被发现。', 'Pīshàng yǐnxíng dǒupéng hòu, yèlǐ zǒu zài zǒuláng yě búhuì bèi fāxiàn.', 'Khoác áo choàng tàng hình lên thì đêm đi hành lang cũng không bị phát hiện.'],
    ['x_chengbao', '城堡', 'chéngbǎo', 'danh từ', 'lâu đài cổ kính', '黑湖对岸矗立着灯火璀璨的魔法城堡。', 'Hēihú duì’àn chùlìzhe dēnghuǒ cuǐcàn de mófǎ chéngbǎo.', 'Bên kia Hồ Đen sừng sững tòa lâu đài phép thuật rực rỡ ánh đèn.'],
  ], 'magic'),
  ...buildPackLexicon('zh', 4, 'intermediate', [
    ['x_shouhushen', '守护神', 'shǒuhùshén', 'danh từ', 'thần hộ mệnh', '集中精力回忆最幸福的事，就能召唤银色守护神。', 'Jízhōng jīnglì huíyì zuì xìngfú de shì, jiù néng zhàohuàn yínsè shǒuhùshén.', 'Tập trung nhớ về ký ức hạnh phúc nhất sẽ triệu hồi được thần hộ mệnh ánh bạc.'],
    ['x_sushe', '宿舍', 'sùshè', 'danh từ', 'ký túc xá Nhà học viện', '学院宿舍的公共休息室里燃着温暖的壁炉。', 'Xuéyuàn sùshè de gōnggòng xiūxishì lǐ ránzhe wēnnuǎn de bìlú.', 'Phòng sinh hoạt chung ký túc xá học viện luôn ấm ánh lò sưởi.'],
  ], 'magic'),
  ...buildPackLexicon('zh', 5, 'intermediate', [
    ['x_yuyan', '预言', 'yùyán', 'danh từ', 'lời tiên tri', '那颗发光的水晶球中封存着一段古老预言。', 'Nà kē fāguāng de shuǐjīngqiú zhōng fēngcúnzhe yí duàn gǔlǎo yùyán.', 'Trong quả cầu pha lê phát sáng lưu giữ một lời tiên tri cổ xưa.'],
    ['x_juedou', '决斗', 'juédòu', 'danh từ/động từ', 'trận đấu tay đôi pháp thuật', '友谊决斗开始前，两位队长互相行了礼。', 'Yǒuyì juédòu kāishǐ qián, liǎng wèi duìzhǎng hùxiāng xíng le lǐ.', 'Trước trận đấu tay đôi giao hữu, hai đội trưởng cúi chào nhau lịch thiệp.'],
  ], 'magic'),
  ...buildPackLexicon('zh', 6, 'intermediate', [
    ['x_lianjinshu', '炼金术', 'liànjīnshù', 'danh từ', 'thuật giả kim', '学者们在图书馆禁书区研读中世纪炼金术典籍。', 'Xuézhěmen zài túshūguǎn jìnshūqū yándú zhōngshìjì liànjīnshù diǎnjí.', 'Các học giả nghiên cứu cổ thư thuật giả kim tại khu vực sách cấm.'],
    ['x_xiaozhang', '校长', 'xiàozhǎng', 'danh từ', 'hiệu trưởng', '睿智的老校长在开学晚宴上向全体学生致词。', 'Ruìzhì de lǎo xiàozhǎng zài kāixué wǎnyàn shàng xiàng quántǐ xuésheng zhìcí.', 'Vị hiệu trưởng thông thái phát biểu chào đón học sinh trong tiệc khai giảng.'],
  ], 'magic'),
  ...buildPackLexicon('zh', 7, 'intermediate', [
    ['x_hushenfu', '护身符', 'hùshēnfú', 'danh từ', 'bùa hộ mệnh', '她随身佩戴一枚银色凤凰护身符以保旅途平安。', 'Tā suíshēn pèidài yì méi yínsè fènghuáng hùshēnfú yǐ bǎo lǚtú píng’ān.', 'Cô ấy mang theo chiếc bùa hộ mệnh phượng hoàng bạc cầu bình an đường xa.'],
    ['x_mofashu', '魔法书', 'mófǎshū', 'danh từ', 'sách thần chú cổ', '这本古旧魔法书的页边写满了前辈的心得。', 'Zhè běn gǔjiù mófǎshū de yèbiān xiěmǎn le qiánbèi de xīndé.', 'Lề trang quyển sách phép cũ ghi chật kín tâm đắc của tiền bối.'],
  ], 'magic'),
  ...buildPackLexicon('zh', 8, 'advanced', [
    ['x_bianxing', '变形术', 'biànxíngshù', 'danh từ', 'môn biến hình pháp thuật', '学好变形术需要极高的专注力与精准控制。', 'Xuéhǎo biànxíngshù xūyào jígāo de zhuānzhùlì yǔ jīngzhǔn kòngzhì.', 'Học giỏi môn Biến hình đòi hỏi độ tập trung cực cao và kiểm soát chuẩn xác.'],
    ['x_yinchang', '吟唱', 'yínchàng', 'động từ', 'ngâm niệm câu chú cổ', '哪怕吟唱错了一个音节，法术效果也会大相径庭。', 'Nǎpà yínchàng cuò le yí ge yīnjié, fǎshù xiàoguǒ yě huì dà xiāng jìngtíng.', 'Dù chỉ ngâm sai một âm tiết, hiệu quả phép thuật cũng khác hẳn.'],
  ], 'magic'),
  ...buildPackLexicon('zh', 9, 'advanced', [
    ['x_xuanfu', '悬浮咒', 'xuánfúzhòu', 'danh từ', 'bùa bay lơ lửng', '轻巧地一抖手腕，羽毛就在悬浮咒下缓缓升起。', 'Qīngqiǎo de yì dǒu shǒuwàn, yǔmáo jiù zài xuánfúzhòu xià huǎnhuǎn shēngqǐ.', 'Khẽ vẩy cổ tay nhẹ nhàng, chiếc lông vũ từ từ bay bổng nhờ bùa lơ lửng.'],
    ['x_huanying', '幻影移形', 'huànyǐng yíxíng', 'danh từ', 'độn thổ, dịch chuyển tức thời', '巫师必须通过严格考核才能获准使用幻影移形。', 'Wūshī bìxū tōngguò yángé kǎohé cáinéng huòzhǔn shǐyòng huànyǐng yíxíng.', 'Phù thủy phải vượt qua kỳ thi nghiêm ngặt mới được phép dùng độn thổ.'],
  ], 'magic'),
  ...buildPackLexicon('zh', 10, 'advanced', [
    ['x_toushi', '预知力', 'yùzhīlì', 'danh từ', 'nhãn thông, năng lực thấu thị tiên tri', '真正的预知力绝非仅靠观察茶叶就能强求的。', 'Zhēnzhèng de yùzhīlì juéfēi jǐn kào guānchá cháyè jiù néng qiángqiú de.', 'Năng lực thấu thị thực thụ không thể ép buộc chỉ qua việc xem bã trà.'],
    ['x_mishu', '秘术', 'mìshù', 'danh từ', 'bí thuật pháp sư cổ đại', '古老典籍记载了守护整座城堡的传奇秘术。', 'Gǔlǎo diǎnjí jìzǎi le shǒuhù zhěng zuò chéngbǎo de chuánqí mìshù.', 'Cổ thư ghi lại bí thuật huyền thoại bảo vệ cả tòa lâu đài.'],
  ], 'magic'),
];

export const ZH_EXPANDED_CURATED: CuratedQuizItem[] = [
  {
    id: 'zh_x_daily_dial_1',
    lang: 'zh',
    tier: 'beginner',
    levelBand: 2,
    topic: 'daily',
    format: 'dialogue_reply',
    promptVi: 'Bạn thân xin lỗi vì kẹt xe nên đến trễ — chọn lời đáp ấm áp tự nhiên nhất:',
    stemText: '朋友：“真抱歉我迟到了，路上太堵车了！”',
    stemPhonetic: 'Zhēn bàoqiàn wǒ chídào le, lùshàng tài dǔchē le!',
    fullSentence: '没关系，我也刚刚才到呢！',
    fullPhonetic: 'Méi guānxi, wǒ yě gānggāng cái dào ne!',
    translationVi: 'Không sao đâu, mình cũng vừa mới đến thôi mà!',
    choices: [
      '没关系，我也刚刚才到呢！',
      '机场在城北三十公里处。',
      '请先保存好购物收据。',
      '图书馆晚上九点闭馆。',
    ],
    correctIndex: 0,
    grammarTitleVi: 'Đáp lời xin lỗi tự nhiên: 没关系 + 刚刚才 (vừa mới tức thì)',
    grammarExplainVi: 'Dùng "没关系" (không sao đâu) kèm "刚刚才到" (vừa mới tới xong) là cách đáp lại lịch sự, thoải mái nhất khi bạn bè đến muộn.',
    vocabNotes: [
      { word: '没关系', phonetic: 'méi guānxi', posVi: 'cụm giao tiếp', meaningVi: 'không sao đâu' },
      { word: '刚刚', phonetic: 'gānggāng', posVi: 'phó từ', meaningVi: 'vừa mới' },
    ],
  },
  {
    id: 'zh_x_travel_cloze_1',
    lang: 'zh',
    tier: 'intermediate',
    levelBand: 4,
    topic: 'travel',
    format: 'grammar_cloze',
    promptVi: 'Chọn từ đúng để hỏi đường tới ga tàu điện ngầm gần nhất:',
    stemText: '请问，____最近的地铁站怎么走？',
    stemPhonetic: 'Qǐngwèn, ____ zuìjìn de dìtiězhàn zěnme zǒu?',
    fullSentence: '请问，去最近的地铁站怎么走？',
    fullPhonetic: 'Qǐngwèn, qù zuìjìn de dìtiězhàn zěnme zǒu?',
    translationVi: 'Xin hỏi, đi tới ga tàu điện ngầm gần nhất đi thế nào ạ?',
    choices: ['去', '把', '被', '比'],
    choicePhonetics: ['qù', 'bǎ', 'bèi', 'bǐ'],
    correctIndex: 0,
    grammarTitleVi: 'Mẫu hỏi đường chuẩn HSK: 请问，去 + Địa điểm + 怎么走？',
    grammarExplainVi: 'Động từ "去" (đi đến) kết hợp với "怎么走" (đi thế nào) tạo thành câu hỏi đường thông dụng và lịch sự nhất khi du lịch.',
    vocabNotes: [
      { word: '地铁站', phonetic: 'dìtiězhàn', posVi: 'danh từ', meaningVi: 'ga tàu điện ngầm' },
      { word: '怎么走', phonetic: 'zěnme zǒu', posVi: 'cụm hỏi đường', meaningVi: 'đi như thế nào' },
    ],
  },
  {
    id: 'zh_x_tech_sent_1',
    lang: 'zh',
    tier: 'intermediate',
    levelBand: 5,
    topic: 'study_tech',
    format: 'sentence_builder',
    promptVi: 'Sắp xếp thẻ từ để nói: "Chúng ta phải hoàn thành báo cáo trước hạn chót."',
    stemText: 'Chúng ta phải hoàn thành báo cáo trước hạn chót.',
    fullSentence: '我们必须在截止日期前完成报告。',
    fullPhonetic: 'Wǒmen bìxū zài jiézhǐ rìqī qián wánchéng bàogào.',
    translationVi: 'Chúng ta bắt buộc phải hoàn thành báo cáo trước hạn chót.',
    orderedTokens: ['我们', '必须', '在', '截止日期前', '完成', '报告。'],
    distractorTokens: ['以后'],
    grammarTitleVi: 'Trạng ngữ thời gian 在 + Thời điểm + 前 đứng trước động từ',
    grammarExplainVi: 'Trong tiếng Trung, cụm "在截止日期前" (trước hạn chót) đặt sau "必须" và đứng trước động từ chính "完成报告".',
    vocabNotes: [
      { word: '截止日期', phonetic: 'jiézhǐ rìqī', posVi: 'danh từ', meaningVi: 'hạn chót' },
      { word: '必须', phonetic: 'bìxū', posVi: 'phó từ', meaningVi: 'bắt buộc phải' },
    ],
  },
  {
    id: 'zh_x_health_cloze_1',
    lang: 'zh',
    tier: 'intermediate',
    levelBand: 6,
    topic: 'health_hobby',
    format: 'grammar_cloze',
    promptVi: 'Chọn cặp liên từ chỉ mục đích rèn luyện thể lực:',
    stemText: '____增强耐力，她每天清晨都坚持游泳半小时。',
    stemPhonetic: '____ zēngqiáng nàilì, tā měitiān qīngchén dōu jiānchí yóuyǒng bàn xiǎoshí.',
    fullSentence: '为了增强耐力，她每天清晨都坚持游泳半小时。',
    fullPhonetic: 'Wèile zēngqiáng nàilì, tā měitiān qīngchén dōu jiānchí yóuyǒng bàn xiǎoshí.',
    translationVi: 'Để tăng cường sức bền, mỗi sáng sớm cô ấy đều kiên trì bơi nửa tiếng.',
    choices: ['为了', '虽然', '除非', '尽管'],
    choicePhonetics: ['wèile', 'suīrán', 'chúfēi', 'jǐnguǎn'],
    correctIndex: 0,
    grammarTitleVi: 'Giới từ chỉ mục đích đứng đầu câu: 为了 + Mục tiêu，...',
    grammarExplainVi: '"为了" (để, nhằm mục đích) đặt ở đầu câu giới thiệu rõ mục tiêu "增强耐力" (tăng sức bền) trước hành động thực hiện.',
    vocabNotes: [
      { word: '为了', phonetic: 'wèile', posVi: 'giới từ', meaningVi: 'để mà, vì mục đích' },
      { word: '耐力', phonetic: 'nàilì', posVi: 'danh từ', meaningVi: 'sức bền' },
    ],
  },
  {
    id: 'zh_x_magic_cloze_1',
    lang: 'zh',
    tier: 'advanced',
    levelBand: 8,
    topic: 'magic',
    format: 'grammar_cloze',
    promptVi: 'Chọn cấu trúc HSK 5–6 cho câu về thần chú Hogwarts:',
    stemText: '她____准确吟唱了古老咒语，而且还精通无声魔法。',
    stemPhonetic: 'Tā ____ zhǔnquè yínchàng le gǔlǎo zhòuyǔ, érqiě hái jīngtōng wúshēng mófǎ.',
    fullSentence: '她不仅准确吟唱了古老咒语，而且还精通无声魔法。',
    fullPhonetic: 'Tā bùjǐn zhǔnquè yínchàng le gǔlǎo zhòuyǔ, érqiě hái jīngtōng wúshēng mófǎ.',
    translationVi: 'Cô ấy không chỉ ngâm chuẩn xác câu thần chú cổ mà còn tinh thông phép thuật không lời.',
    choices: ['不仅', '与其', '宁可', '哪怕'],
    choicePhonetics: ['bùjǐn', 'yǔqí', 'nìngkě', 'nǎpà'],
    correctIndex: 0,
    grammarTitleVi: 'Liên từ tăng tiến: 不仅...，而且还... (Không những..., mà còn...)',
    grammarExplainVi: 'Vế sau có "而且还" (mà còn), đi cặp chuẩn với "不仅" ở vế trước để nhấn mạnh trình độ vượt trội ở cả hai kỹ năng.',
    vocabNotes: [
      { word: '吟唱', phonetic: 'yínchàng', posVi: 'động từ', meaningVi: 'ngâm niệm thần chú' },
      { word: '精通', phonetic: 'jīngtōng', posVi: 'động từ', meaningVi: 'tinh thông, thành thạo bậc thầy' },
    ],
  },
];
