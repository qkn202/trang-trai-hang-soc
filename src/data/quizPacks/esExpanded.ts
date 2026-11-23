import { CuratedQuizItem, QuizLexiconEntry } from '../languageQuizBank';
import { buildPackLexicon } from './packHelper';

// +100 từ vựng Tiếng Tây Ban Nha mở rộng (5 chủ đề × 20 từ: 36 Sơ cấp, 40 Trung cấp, 24 Cao cấp)
export const ES_EXPANDED_LEXICON: QuizLexiconEntry[] = [
  // ==================== 1. GIAO TIẾP, CẢM XÚC & QUAN HỆ (daily — 20 từ) ====================
  ...buildPackLexicon('es', 1, 'beginner', [
    ['x_amigo', 'el amigo', 'el a-mi-go', 'danh từ', 'người bạn', 'Mi mejor amigo siempre me escucha cuando estoy triste.', 'Mi me-hor a-mi-go siem-pre me es-ku-cha kuan-do es-toi tris-te.', 'Người bạn thân nhất luôn lắng nghe mỗi khi tôi buồn.'],
    ['x_sonrisa', 'la sonrisa', 'la son-ri-sa', 'danh từ', 'nụ cười', 'Una sonrisa cálida hace que todos se sientan bienvenidos.', 'U-na son-ri-sa ka-li-da a-se ke to-dos se sien-tan bien-be-ni-dos.', 'Một nụ cười ấm áp khiến mọi người đều thấy được chào đón.'],
    ['x_cumpleanos', 'el cumpleaños', 'el kum-ple-a-nyos', 'danh từ', 'ngày sinh nhật', 'Preparamos una fiesta sorpresa para su cumpleaños esta noche.', 'Pre-pa-ra-mos u-na fies-ta sor-pre-sa pa-ra su kum-ple-a-nyos es-ta no-che.', 'Tối nay chúng tôi chuẩn bị bữa tiệc bất ngờ mừng sinh nhật cô ấy.'],
  ], 'daily'),
  ...buildPackLexicon('es', 2, 'beginner', [
    ['x_disculparse', 'disculparse', 'dis-kul-par-se', 'động từ', 'xin lỗi', 'Llamó enseguida para disculparse por llegar tarde.', 'Ya-mo en-se-gi-da pa-ra dis-kul-par-se por ye-gar tar-de.', 'Anh ấy gọi ngay lập tức để xin lỗi vì đến muộn.'],
    ['x_emocionado', 'emocionado', 'e-mo-sio-na-do', 'tính từ', 'hào hứng, phấn khích', 'Los estudiantes están emocionados por el viaje del fin de semana.', 'Los es-tu-dian-tes es-tan e-mo-sio-na-dos por el bia-he del fin de se-ma-na.', 'Các học sinh rất hào hứng với chuyến đi cuối tuần.'],
    ['x_abrazo', 'el abrazo', 'el a-bra-so', 'danh từ', 'cái ôm ấm áp', 'Le dio un gran abrazo a su hermano menor en la estación.', 'Le dio un gran a-bra-so a su er-ma-no me-nor en la es-ta-sion.', 'Cô ấy ôm chầm lấy em trai tại nhà ga.'],
  ], 'daily'),
  ...buildPackLexicon('es', 3, 'beginner', [
    ['x_sincero', 'sincero', 'sin-se-ro', 'tính từ', 'chân thành, thật lòng', 'Gracias por darme un consejo tan sincero hoy.', 'Gra-sias por dar-me un kon-se-ho tan sin-se-ro oi.', 'Cảm ơn bạn hôm nay đã cho tôi lời khuyên thật lòng như vậy.'],
    ['x_solitario', 'solitario', 'so-li-ta-rio', 'tính từ', 'cô đơn, lẻ loi', 'Llamar a viejos amigos ayuda cuando te sientes solitario.', 'Ya-mar a bie-hos a-mi-gos a-yu-da kuan-do te sien-tes so-li-ta-rio.', 'Gọi cho bạn cũ giúp ích nhiều mỗi khi bạn thấy cô đơn.'],
  ], 'daily'),
  ...buildPackLexicon('es', 4, 'intermediate', [
    ['x_animar', 'animar', 'a-ni-mar', 'động từ', 'khích lệ, động viên', 'Los buenos compañeros siempre se animan tras una derrota difícil.', 'Los bue-nos kom-pa-nye-ros siem-pre se a-ni-man tras u-na de-rro-ta di-fi-sil.', 'Đồng đội tốt luôn động viên nhau sau trận thua khó khăn.'],
    ['x_avergonzado', 'avergonzado', 'a-ber-gon-sa-do', 'tính từ', 'ngượng ngùng, xấu hổ', 'Me sentí avergonzado cuando olvidé el nombre de mi compañero.', 'Me sen-ti a-ber-gon-sa-do kuan-do ol-bi-de el nom-bre de mi kom-pa-nye-ro.', 'Tôi thấy ngượng khi lỡ quên tên bạn cùng lớp.'],
  ], 'daily'),
  ...buildPackLexicon('es', 5, 'intermediate', [
    ['x_malentendido', 'el malentendido', 'el ma-len-ten-di-do', 'danh từ', 'sự hiểu lầm', 'Una charla tranquila aclaró todo el malentendido al instante.', 'U-na char-la tran-ki-la a-kla-ro to-do el ma-len-ten-di-do al ins-tan-te.', 'Một cuộc trò chuyện bình tĩnh đã hóa giải ngay toàn bộ hiểu lầm.'],
    ['x_confiable', 'confiable', 'kon-fia-ble', 'tính từ', 'đáng tin cậy', 'Todos confían en Mateo porque es sereno y confiable.', 'To-dos kon-fi-an en Ma-te-o por-ke es se-re-no i kon-fia-ble.', 'Ai cũng tin tưởng Mateo vì cậu ấy điềm tĩnh và đáng tin cậy.'],
  ], 'daily'),
  ...buildPackLexicon('es', 6, 'intermediate', [
    ['x_acuerdo', 'el compromiso', 'el kom-pro-mi-so', 'danh từ', 'thỏa hiệp, cam kết chung', 'Ambas partes llegaron a un compromiso justo antes de cenar.', 'Am-bas par-tes ye-ga-ron a un kom-pro-mi-so hus-to an-tes de se-nar.', 'Cả hai bên đã đạt thỏa hiệp công bằng trước bữa tối.'],
    ['x_valorar', 'valorar', 'ba-lo-rar', 'động từ', 'trân trọng, đánh giá cao', 'Debemos valorar cada momento que compartimos con la familia.', 'De-be-mos ba-lo-rar ka-da mo-men-to ke kom-par-ti-mos kon la fa-mi-lia.', 'Chúng ta nên trân trọng từng khoảnh khắc bên gia đình.'],
  ], 'daily'),
  ...buildPackLexicon('es', 7, 'intermediate', [
    ['x_compasion', 'la compasión', 'la kom-pa-sion', 'danh từ', 'lòng cảm thông, trắc ẩn', 'Escuchó con profunda compasión mientras su amiga lloraba.', 'Es-ku-cho kon pro-fun-da kom-pa-sion mien-tras su a-mi-ga yo-ra-ba.', 'Cô ấy lắng nghe bằng sự cảm thông sâu sắc khi bạn mình khóc.'],
    ['x_confianza', 'la confianza', 'la kon-fian-sa', 'danh từ', 'sự tin tưởng, tín nhiệm', 'La confianza construida durante años no se rompe fácilmente.', 'La kon-fian-sa kons-trui-da du-ran-te a-nyos no se rom-pe fa-sil-men-te.', 'Niềm tin gây dựng qua nhiều năm không dễ dàng bị phá vỡ.'],
  ], 'daily'),
  ...buildPackLexicon('es', 8, 'advanced', [
    ['x_empatia', 'la empatía', 'la em-pa-ti-a', 'danh từ', 'sự thấu cảm', 'La verdadera empatía nos permite mirar el mundo con otros ojos.', 'La ber-da-de-ra em-pa-ti-a nos per-mi-te mi-rar el mun-do kon o-tros o-hos.', 'Sự thấu cảm thực sự giúp ta nhìn thế giới qua đôi mắt người khác.'],
    ['x_reconciliar', 'reconciliarse', 're-kon-si-liar-se', 'động từ', 'hòa giải, làm lành', 'Tras años de distancia, los dos rivales decidieron reconciliarse.', 'Tras a-nyos de dis-tan-sia, los dos ri-ba-les de-si-die-ron re-kon-si-liar-se.', 'Sau nhiều năm xa cách, hai đối thủ quyết định làm lành với nhau.'],
  ], 'daily'),
  ...buildPackLexicon('es', 9, 'advanced', [
    ['x_elocuente', 'elocuente', 'e-lo-kuen-te', 'tính từ', 'hùng hồn, ăn nói lưu loát', 'Su discurso elocuente conmovió a todos en el auditorio.', 'Su dis-kur-so e-lo-kuen-te kon-mo-bio a to-dos en el au-di-to-rio.', 'Bài phát biểu hùng hồn của cô đã lay động cả hội trường.'],
  ], 'daily'),
  ...buildPackLexicon('es', 10, 'advanced', [
    ['x_camaraderia', 'la camaradería', 'la ka-ma-ra-de-ri-a', 'danh từ', 'tình đồng đội gắn bó', 'Los retos compartidos forjaron una profunda camaradería en el equipo.', 'Los re-tos kom-par-ti-dos for-ha-ron u-na pro-fun-da ka-ma-ra-de-ri-a en el e-ki-po.', 'Những thử thách chung đã tôi luyện tình đồng đội sâu sắc cho cả đội.'],
  ], 'daily'),

  // ==================== 2. DU LỊCH, ĂN UỐNG, MUA SẮM & THÀNH PHỐ (travel — 20 từ) ====================
  ...buildPackLexicon('es', 1, 'beginner', [
    ['x_pasaporte', 'el pasaporte', 'el pa-sa-por-te', 'danh từ', 'hộ chiếu', 'Guarda tu pasaporte en un bolsillo seguro antes de viajar.', 'Guar-da tu pa-sa-por-te en un bol-si-yo se-gu-ro an-tes de bia-har.', 'Hãy cất hộ chiếu vào túi an toàn trước khi đi du lịch.'],
    ['x_aeropuerto', 'el aeropuerto', 'el a-e-ro-puer-to', 'danh từ', 'sân bay', 'Debemos llegar al aeropuerto dos horas antes del vuelo.', 'De-be-mos ye-gar al a-e-ro-puer-to dos o-ras an-tes del bue-lo.', 'Chúng ta nên tới sân bay trước giờ bay hai tiếng.'],
    ['x_billete', 'el billete', 'el bi-ye-te', 'danh từ', 'tấm vé tàu/máy bay', 'Muestra tu billete de tren al revisor en el andén nueve.', 'Mues-tra tu bi-ye-te de tren al re-bi-sor en el an-den nue-be.', 'Hãy xuất trình vé tàu cho người soát vé tại sân ga số chín.'],
  ], 'travel'),
  ...buildPackLexicon('es', 2, 'beginner', [
    ['x_hotel', 'el hotel', 'el o-tel', 'danh từ', 'khách sạn', 'Nuestro hotel junto al mar tiene un balcón frente a la bahía.', 'Nues-tro o-tel hun-to al mar tie-ne un bal-kon fren-te a la ba-i-a.', 'Khách sạn ven biển của chúng tôi có ban công hướng ra vịnh.'],
    ['x_menu', 'el menú', 'el me-nu', 'danh từ', 'thực đơn', '¿Nos puede traer el menú de la cena y dos vasos de agua?', 'Nos pue-de tra-er el me-nu de la se-na i dos ba-sos de a-gua?', 'Bạn mang giúp chúng tôi thực đơn bữa tối và hai ly nước nhé?'],
    ['x_recibo', 'el recibo', 'el re-si-bo', 'danh từ', 'hóa đơn thanh toán', 'Conserva el recibo por si necesitas cambiar la chaqueta.', 'Kon-ser-ba el re-si-bo por si ne-se-si-tas kam-biar la cha-ke-ta.', 'Hãy giữ hóa đơn phòng khi bạn cần đổi áo khoác.'],
  ], 'travel'),
  ...buildPackLexicon('es', 3, 'beginner', [
    ['x_metro', 'el metro', 'el me-tro', 'danh từ', 'tàu điện ngầm', 'Tomar el metro es mucho más rápido que conducir en hora punta.', 'To-mar el me-tro es mu-cho mas ra-pi-do ke kon-du-sir en o-ra pun-ta.', 'Đi tàu điện ngầm nhanh hơn lái xe rất nhiều vào giờ cao điểm.'],
    ['x_mapa', 'el mapa', 'el ma-pa', 'danh từ', 'bản đồ', 'Consulta el mapa de la ciudad antes de girar a la izquierda.', 'Kon-sul-ta el ma-pa de la siu-dad an-tes de hi-rar a la is-kier-da.', 'Hãy xem bản đồ thành phố trước khi rẽ trái.'],
  ], 'travel'),
  ...buildPackLexicon('es', 4, 'intermediate', [
    ['x_equipaje', 'el equipaje', 'el e-ki-pa-he', 'danh từ', 'hành lý', 'Los pasajeros recogieron su equipaje en la cinta número tres.', 'Los pa-sa-he-ros re-ko-hie-ron su e-ki-pa-he en la sin-ta nu-me-ro tres.', 'Hành khách lấy hành lý của mình tại băng chuyền số ba.'],
    ['x_reserva', 'la reserva', 'la re-ser-ba', 'danh từ', 'sự đặt chỗ trước', 'Hice una reserva para cuatro personas a las siete de la tarde.', 'I-se u-na re-ser-ba pa-ra kua-tro per-so-nas a las sie-te de la tar-de.', 'Tôi đã đặt bàn cho bốn người vào lúc bảy giờ tối.'],
  ], 'travel'),
  ...buildPackLexicon('es', 5, 'intermediate', [
    ['x_salida', 'la salida', 'la sa-li-da', 'danh từ', 'giờ khởi hành, lối ra', 'El panel anuncia que nuestra salida embarca por la puerta doce.', 'El pa-nel a-nun-sia ke nues-tra sa-li-da em-bar-ka por la puer-ta do-se.', 'Bảng điện báo chuyến bay của chúng ta lên máy bay ở cửa 12.'],
    ['x_recuerdo', 'el recuerdo', 'el re-kuer-do', 'danh từ', 'quà lưu niệm, kỷ niệm', 'Compró un farol artesanal como recuerdo de su viaje.', 'Kom-pro un fa-rol ar-te-sa-nal ko-mo re-kuer-do de su bia-he.', 'Cô ấy mua một chiếc đèn lồng thủ công làm quà lưu niệm.'],
  ], 'travel'),
  ...buildPackLexicon('es', 6, 'intermediate', [
    ['x_itinerario', 'el itinerario', 'el i-ti-ne-ra-rio', 'danh từ', 'lịch trình du lịch', 'Nuestro itinerario de cinco días incluye museos y mercados nocturnos.', 'Nues-tro i-ti-ne-ra-rio de sin-ko di-as in-klu-ye mu-se-os i mer-ka-dos nok-tur-nos.', 'Lịch trình năm ngày của chúng tôi gồm bảo tàng và chợ đêm.'],
    ['x_descuento', 'el descuento', 'el des-kuen-to', 'danh từ', 'mức giảm giá', 'Los estudiantes obtienen un veinte por ciento de descuento aquí.', 'Los es-tu-dian-tes ob-tie-nen un bein-te por sien-to de des-kuen-to a-ki.', 'Học sinh được giảm giá 20% tại đây.'],
  ], 'travel'),
  ...buildPackLexicon('es', 7, 'intermediate', [
    ['x_cruce', 'el cruce', 'el kru-se', 'danh từ', 'ngã tư, giao lộ', 'Gira a la derecha en el segundo cruce después de la torre.', 'Hi-ra a la de-re-cha en el se-gun-do kru-se des-pues de la to-rre.', 'Rẽ phải ở ngã tư thứ hai sau tháp đồng hồ nhé.'],
    ['x_moneda', 'la moneda', 'la mo-ne-da', 'danh từ', 'tiền tệ, đồng tiền', 'Puedes cambiar moneda extranjera en el banco del centro.', 'Pue-des kam-biar mo-ne-da eks-tran-he-ra en el ban-ko del sen-tro.', 'Bạn có thể đổi ngoại tệ tại ngân hàng trung tâm.'],
  ], 'travel'),
  ...buildPackLexicon('es', 8, 'advanced', [
    ['x_cosmopolita', 'cosmopolita', 'kos-mo-po-li-ta', 'tính từ', 'đa văn hóa, tầm vóc quốc tế', 'Madrid es una ciudad cosmopolita llena de cafés históricos.', 'Ma-drid es u-na siu-dad kos-mo-po-li-ta ye-na de ka-fes is-to-ri-kos.', 'Madrid là thành phố quốc tế sôi động với nhiều quán cà phê cổ kính.'],
    ['x_hospitalidad', 'la hospitalidad', 'la os-pi-ta-li-dad', 'danh từ', 'lòng hiếu khách', 'Los viajeros jamás olvidaron la cálida hospitalidad de la isla.', 'Los bia-he-ros ha-mas ol-bi-da-ron la ka-li-da os-pi-ta-li-dad de la is-la.', 'Du khách không bao giờ quên lòng hiếu khách nồng hậu của hòn đảo.'],
  ], 'travel'),
  ...buildPackLexicon('es', 9, 'advanced', [
    ['x_excursion', 'la excursión', 'la eks-kur-sion', 'danh từ', 'chuyến du ngoạn, tham quan', 'Reservamos una excursión en barco entre acantilados esmeralda.', 'Re-ser-ba-mos u-na eks-kur-sion en bar-ko en-tre a-kan-ti-la-dos es-me-ral-da.', 'Chúng tôi đặt chuyến du ngoạn thuyền giữa vách đá xanh ngọc.'],
  ], 'travel'),
  ...buildPackLexicon('es', 10, 'advanced', [
    ['x_travesia', 'la travesía', 'la tra-be-si-a', 'danh từ', 'chuyến hải trình / hành trình xuyên miền', 'Aquella larga travesía en tren despertó su pasión por explorar.', 'A-ke-ya lar-ga tra-be-si-a en tren des-per-to su pa-sion por eks-plo-rar.', 'Hành trình tàu dài ấy đã khơi dậy niềm đam mê khám phá của cô.'],
  ], 'travel'),

  // ==================== 3. HỌC TẬP, CÔNG VIỆC & CÔNG NGHỆ (study_tech — 20 từ) ====================
  ...buildPackLexicon('es', 1, 'beginner', [
    ['x_cuaderno', 'el cuaderno', 'el kua-der-no', 'danh từ', 'quyển vở ghi chép', 'Anota cada palabra nueva en tu cuaderno de bolsillo.', 'A-no-ta ka-da pa-la-bra nue-ba en tu kua-der-no de bol-si-yo.', 'Hãy ghi từng từ vựng mới vào quyển vở bỏ túi.'],
    ['x_biblioteca', 'la biblioteca', 'la bi-blio-te-ka', 'danh từ', 'thư viện', 'Muchos estudiantes repasan en silencio dentro de la biblioteca.', 'Mu-chos es-tu-dian-tes re-pa-san en si-len-sio den-tro de la bi-blio-te-ka.', 'Nhiều học sinh ôn bài yên tĩnh trong thư viện.'],
    ['x_mensaje', 'el mensaje', 'el men-sa-he', 'danh từ', 'tin nhắn', 'Envíame un mensaje breve en cuanto llegues a casa.', 'En-bi-a-me un men-sa-he bre-be en kuan-to ye-ges a ka-sa.', 'Nhắn cho mình một tin ngắn ngay khi bạn về tới nhà nhé.'],
  ], 'study_tech'),
  ...buildPackLexicon('es', 2, 'beginner', [
    ['x_teclado', 'el teclado', 'el te-kla-do', 'danh từ', 'bàn phím', 'Escribe muy rápido con su teclado inalámbrico compacto.', 'Es-kri-be mui ra-pi-do kon su te-kla-do i-na-lam-bri-ko kom-pak-to.', 'Cô ấy gõ rất nhanh trên bàn phím không dây nhỏ gọn.'],
    ['x_contrasena', 'la contraseña', 'la kon-tra-se-nya', 'danh từ', 'mật khẩu', 'Nunca compartas tu contraseña personal con desconocidos.', 'Nun-ka kom-par-tas tu kon-tra-se-nya per-so-nal kon des-ko-no-si-dos.', 'Đừng bao giờ chia sẻ mật khẩu cá nhân với người lạ.'],
  ], 'study_tech'),
  ...buildPackLexicon('es', 3, 'beginner', [
    ['x_tarea', 'la tarea', 'la ta-re-a', 'danh từ', 'bài tập về nhà', 'Termina tu tarea de matemáticas antes de jugar videojuegos.', 'Ter-mi-na tu ta-re-a de ma-te-ma-ti-kas an-tes de hu-gar bi-de-o-hue-gos.', 'Hãy làm xong bài tập toán trước khi chơi game nhé.'],
    ['x_reunion', 'la reunión', 'la re-u-nion', 'danh từ', 'cuộc họp', 'Nuestra reunión matutina de equipo comienza puntualmente a las nueve.', 'Nues-tra re-u-nion ma-tu-ti-na de e-ki-po ko-mien-sa pun-tual-men-te a las nue-be.', 'Cuộc họp nhóm buổi sáng bắt đầu đúng chín giờ.'],
  ], 'study_tech'),
  ...buildPackLexicon('es', 4, 'intermediate', [
    ['x_plazo', 'el plazo', 'el pla-so', 'danh từ', 'hạn chót, thời hạn', 'El equipo entregó el informe completo antes del plazo fijado.', 'El e-ki-po en-tre-go el in-for-me kom-ple-to an-tes del pla-so fi-ha-do.', 'Cả nhóm đã nộp đầy đủ báo cáo trước hạn chót quy định.'],
    ['x_colega', 'el colega', 'el ko-le-ga', 'danh từ', 'đồng nghiệp', 'Mi colega me enseñó un atajo muy útil en la hoja de cálculo.', 'Mi ko-le-ga me en-se-nyo un a-ta-ho mui u-til en la o-ha de kal-ku-lo.', 'Đồng nghiệp chỉ cho tôi phím tắt rất tiện trong bảng tính.'],
  ], 'study_tech'),
  ...buildPackLexicon('es', 5, 'intermediate', [
    ['x_beca', 'la beca', 'la be-ka', 'danh từ', 'học bổng', 'Su ensayo sobresaliente le valió una beca universitaria completa.', 'Su en-sa-yo so-bre-sa-lien-te le ba-lio u-na be-ka u-ni-ber-si-ta-ria kom-ple-ta.', 'Bài luận xuất sắc đã mang về cho cô học bổng đại học toàn phần.'],
    ['x_notificacion', 'la notificación', 'la no-ti-fi-ka-sion', 'danh từ', 'thông báo ứng dụng', 'Desactiva las notificaciones del móvil mientras preparas el examen.', 'De-sak-ti-ba las no-ti-fi-ka-sio-nes del mo-bil mien-tras pre-pa-ras el ek-sa-men.', 'Hãy tắt thông báo điện thoại trong lúc ôn thi.'],
  ], 'study_tech'),
  ...buildPackLexicon('es', 6, 'intermediate', [
    ['x_presentacion', 'la presentación', 'la pre-sen-ta-sion', 'danh từ', 'bài thuyết trình', 'Ensayó su presentación con diapositivas dos veces antes del seminario.', 'En-sa-yo su pre-sen-ta-sion kon dia-po-si-ti-bas dos be-ses an-tes del se-mi-na-rio.', 'Anh ấy tập dượt bài thuyết trình hai lần trước buổi hội thảo.'],
    ['x_opinion', 'la retroalimentación', 'la re-tro-a-li-men-ta-sion', 'danh từ', 'phản hồi góp ý', 'Una retroalimentación constructiva ayuda a pulir cada capítulo.', 'U-na re-tro-a-li-men-ta-sion kons-truk-ti-ba a-yu-da a pu-lir ka-da ka-pi-tu-lo.', 'Góp ý mang tính xây dựng giúp trau chuốt từng chương sách.'],
  ], 'study_tech'),
  ...buildPackLexicon('es', 7, 'intermediate', [
    ['x_algoritmo', 'el algoritmo', 'el al-go-rit-mo', 'danh từ', 'thuật toán', 'El algoritmo de búsqueda muestra primero las respuestas más precisas.', 'El al-go-rit-mo de bus-ke-da mues-tra pri-me-ro las res-pues-tas mas pre-si-sas.', 'Thuật toán tìm kiếm ưu tiên hiển thị các đáp án chính xác nhất.'],
    ['x_aplicacion', 'la aplicación', 'la a-pli-ka-sion', 'danh từ', 'ứng dụng phần mềm', 'Esta aplicación de idiomas registra tu racha diaria de repaso.', 'Es-ta a-pli-ka-sion de i-dio-mas re-his-tra tu ra-cha dia-ria de re-pa-so.', 'Ứng dụng ngoại ngữ này ghi lại chuỗi ôn tập mỗi ngày của bạn.'],
  ], 'study_tech'),
  ...buildPackLexicon('es', 8, 'advanced', [
    ['x_innovacion', 'la innovación', 'la in-no-ba-sion', 'danh từ', 'sự đổi mới sáng tạo', 'La innovación en energías limpias transforma las ciudades modernas.', 'La in-no-ba-sion en e-ner-hi-as lim-pias trans-for-ma las siu-da-des mo-der-nas.', 'Đổi mới năng lượng sạch đang chuyển hóa các đô thị hiện đại.'],
    ['x_cifrado', 'el cifrado', 'el si-fra-do', 'danh từ', 'sự mã hóa bảo mật', 'El cifrado avanzado protege los mensajes privados frente a ataques.', 'El si-fra-do a-ban-sa-do pro-te-he los men-sa-hes pri-ba-dos fren-te a a-ta-kes.', 'Mã hóa nâng cao bảo vệ tin nhắn riêng tư trước các cuộc tấn công.'],
  ], 'study_tech'),
  ...buildPackLexicon('es', 9, 'advanced', [
    ['x_dominio', 'el dominio', 'el do-mi-nio', 'danh từ', 'sự thông thạo, làm chủ kỹ năng', 'La práctica oral constante construye un auténtico dominio del idioma.', 'La prak-ti-ka o-ral kons-tan-te kons-tru-ye un au-ten-ti-ko do-mi-nio del i-dio-ma.', 'Luyện nói đều đặn xây dựng năng lực thông thạo ngôn ngữ thực thụ.'],
    ['x_automatizacion', 'la automatización', 'la au-to-ma-ti-sa-sion', 'danh từ', 'tự động hóa', 'La automatización inteligente ahorra horas de pruebas repetitivas.', 'La au-to-ma-ti-sa-sion in-te-li-hen-te a-o-rra o-ras de prue-bas re-pe-ti-ti-bas.', 'Tự động hóa thông minh tiết kiệm nhiều giờ kiểm thử lặp lại.'],
  ], 'study_tech'),
  ...buildPackLexicon('es', 10, 'advanced', [
    ['x_paradigma', 'el paradigma', 'el pa-ra-dig-ma', 'danh từ', 'hệ hình chuẩn mực mới', 'La inteligencia artificial inauguró un nuevo paradigma tecnológico.', 'La in-te-li-hen-sia ar-ti-fi-sial i-nau-gu-ro un nue-bo pa-ra-dig-ma tek-no-lo-hi-ko.', 'Trí tuệ nhân tạo đã mở ra một mô hình công nghệ hoàn toàn mới.'],
  ], 'study_tech'),

  // ==================== 4. SỨC KHỎE, THỂ THAO, ÂM NHẠC & GIẢI TRÍ (health_hobby — 20 từ) ====================
  ...buildPackLexicon('es', 1, 'beginner', [
    ['x_hospital', 'el hospital', 'el os-pi-tal', 'danh từ', 'bệnh viện', 'El hospital central atiende urgencias las veinticuatro horas.', 'El os-pi-tal sen-tral a-tien-de ur-hen-sias las bein-ti-kua-tro o-ras.', 'Bệnh viện trung tâm trực cấp cứu suốt hai mươi bốn giờ.'],
    ['x_fiebre', 'la fiebre', 'la fie-bre', 'danh từ', 'cơn sốt', 'Bebe bastante agua y descansa bien si tienes fiebre.', 'Be-be bas-tan-te a-gua i des-kan-sa bien si tie-nes fie-bre.', 'Hãy uống đủ nước và nghỉ ngơi thật tốt nếu bạn bị sốt.'],
    ['x_guitarra', 'la guitarra', 'la gi-ta-rra', 'danh từ', 'đàn ghi-ta', 'Toca la guitarra acústica junto a la fogata cada verano.', 'To-ka la gi-ta-rra a-kus-ti-ka hun-to a la fo-ga-ta ka-da be-ra-no.', 'Cậu ấy chơi đàn ghi-ta mộc bên lửa trại mỗi mùa hè.'],
  ], 'health_hobby'),
  ...buildPackLexicon('es', 2, 'beginner', [
    ['x_medicina', 'la medicina', 'la me-di-si-na', 'danh từ', 'thuốc chữa bệnh, y học', 'Toma esta medicina después de las comidas según indicó el médico.', 'To-ma es-ta me-di-si-na des-pues de las ko-mi-das se-gun in-di-ko el me-di-ko.', 'Hãy uống thuốc này sau bữa ăn theo chỉ dẫn của bác sĩ.'],
    ['x_concierto', 'el concierto', 'el kon-sier-to', 'danh từ', 'buổi hòa nhạc', 'Las entradas para el concierto sinfónico se agotaron en diez minutos.', 'Las en-tra-das pa-ra el kon-sier-to sin-fo-ni-ko se a-go-ta-ron en dies mi-nu-tos.', 'Vé cho buổi hòa nhạc giao hưởng bán hết sạch trong mười phút.'],
  ], 'health_hobby'),
  ...buildPackLexicon('es', 3, 'beginner', [
    ['x_natacion', 'la natación', 'la na-ta-sion', 'danh từ', 'môn bơi lội', 'La natación matutina mantiene mi espalda fuerte y relajada.', 'La na-ta-sion ma-tu-ti-na man-tie-ne mi es-pal-da fuer-te i re-la-ha-da.', 'Bơi lội buổi sáng giúp lưng tôi khỏe khoắn và thư thái.'],
    ['x_camara', 'la cámara', 'la ka-ma-ra', 'danh từ', 'máy ảnh', 'Llevó su cámara clásica para retratar la vida callejera.', 'Ye-bo su ka-ma-ra kla-si-ka pa-ra re-tra-tar la bi-da ka-ye-he-ra.', 'Cô ấy mang chiếc máy ảnh cổ điển đi chụp nhịp sống đường phố.'],
  ], 'health_hobby'),
  ...buildPackLexicon('es', 4, 'intermediate', [
    ['x_nutricion', 'la nutrición', 'la nu-tri-sion', 'danh từ', 'dinh dưỡng', 'Una nutrición equilibrada y dormir bien mejoran la concentración.', 'U-na nu-tri-sion e-ki-li-bra-da i dor-mir bien me-ho-ran la kon-sen-tra-sion.', 'Dinh dưỡng cân bằng và ngủ đủ giấc giúp tăng khả năng tập trung.'],
    ['x_melodia', 'la melodía', 'la me-lo-di-a', 'danh từ', 'giai điệu', 'Esa dulce melodía de piano no sale de mi cabeza hoy.', 'E-sa dul-se me-lo-di-a de pia-no no sa-le de mi ka-be-sa oi.', 'Giai điệu piano ngọt ngào ấy cứ ngân vang trong đầu tôi cả ngày.'],
  ], 'health_hobby'),
  ...buildPackLexicon('es', 5, 'intermediate', [
    ['x_resistencia', 'la resistencia', 'la re-sis-ten-sia', 'danh từ', 'sức bền, độ dẻo dai', 'Correr largas distancias desarrolla gradualmente la resistencia física.', 'Ko-rrer lar-gas dis-tan-sias de-sa-rro-ya gra-dual-men-te la re-sis-ten-sia fi-si-ka.', 'Chạy đường dài giúp nâng cao sức bền thể chất từng bước một.'],
    ['x_director', 'el director', 'el di-rek-tor', 'danh từ', 'đạo diễn, giám đốc', 'El director de cine ganó un premio por su fotografía impecable.', 'El di-rek-tor de si-ne ga-no un pre-mio por su fo-to-gra-fi-a im-pe-ka-ble.', 'Vị đạo diễn phim đoạt giải lớn nhờ khung hình xuất sắc.'],
  ], 'health_hobby'),
  ...buildPackLexicon('es', 6, 'intermediate', [
    ['x_receta', 'la receta médica', 'la re-se-ta me-di-ka', 'danh từ', 'đơn thuốc của bác sĩ', 'Presenta la receta médica en la farmacia de la esquina.', 'Pre-sen-ta la re-se-ta me-di-ka en la far-ma-sia de la es-ki-na.', 'Hãy xuất trình đơn thuốc tại hiệu thuốc ở góc phố.'],
    ['x_exposicion', 'la exposición', 'la eks-po-si-sion', 'danh từ', 'buổi triển lãm', 'La exposición de arte contemporáneo abre este sábado por la mañana.', 'La eks-po-si-sion de ar-te kon-tem-po-ra-ne-o a-bre es-te sa-ba-do por la ma-nya-na.', 'Triển lãm nghệ thuật đương đại mở cửa sáng thứ Bảy này.'],
  ], 'health_hobby'),
  ...buildPackLexicon('es', 7, 'intermediate', [
    ['x_maraton', 'el maratón', 'el ma-ra-ton', 'danh từ', 'cuộc chạy ma-ra-tông', 'Entrenó durante seis meses para completar su primer maratón.', 'En-tre-no du-ran-te seis me-ses pa-ra kom-ple-tar su pri-mer ma-ra-ton.', 'Cô ấy tập suốt sáu tháng để hoàn thành giải ma-ra-tông đầu tiên.'],
    ['x_meditacion', 'la meditación', 'la me-di-ta-sion', 'danh từ', 'thiền định, tĩnh tâm', 'Diez minutos de meditación matinal serenan la mente agitada.', 'Dies mi-nu-tos de me-di-ta-sion ma-ti-nal se-re-nan la men-te a-hi-ta-da.', 'Mười phút thiền sáng giúp làm dịu tâm trí bận rộn.'],
  ], 'health_hobby'),
  ...buildPackLexicon('es', 8, 'advanced', [
    ['x_inmunidad', 'la inmunidad', 'la in-mu-ni-dad', 'danh từ', 'khả năng miễn dịch', 'El ejercicio regular fortalece la inmunidad natural del organismo.', 'El e-her-si-sio re-gu-lar for-ta-le-se la in-mu-ni-dad na-tu-ral del or-ga-nis-mo.', 'Tập thể dục đều đặn củng cố hệ miễn dịch tự nhiên của cơ thể.'],
    ['x_obra', 'la obra maestra', 'la o-bra ma-es-tra', 'danh từ', 'kiệt tác nghệ thuật', 'La crítica aclamó la película animada como una obra maestra atemporal.', 'La kri-ti-ka a-kla-mo la pe-li-ku-la a-ni-ma-da ko-mo u-na o-bra ma-es-tra a-tem-po-ral.', 'Giới phê bình ca ngợi bộ phim hoạt hình là kiệt tác vượt thời gian.'],
  ], 'health_hobby'),
  ...buildPackLexicon('es', 9, 'advanced', [
    ['x_coreografia', 'la coreografía', 'la ko-re-o-gra-fi-a', 'danh từ', 'biên đạo múa, vũ đạo', 'El espectáculo deslumbró al público con una coreografía impecable.', 'El es-pek-ta-ku-lo des-lum-bro al pu-bli-ko kon u-na ko-re-o-gra-fi-a im-pe-ka-ble.', 'Buổi diễn làm khán giả choáng ngợp với màn vũ đạo hoàn mỹ.'],
    ['x_rehabilitacion', 'la rehabilitación', 'la re-a-bi-li-ta-sion', 'danh từ', 'phục hồi chức năng', 'Una cuidadosa rehabilitación permitió que el atleta volviera a competir.', 'U-na kui-da-do-sa re-a-bi-li-ta-sion per-mi-tio ke el at-le-ta bol-bie-ra a kom-pe-tir.', 'Quá trình phục hồi cẩn thận giúp vận động viên trở lại thi đấu.'],
  ], 'health_hobby'),
  ...buildPackLexicon('es', 10, 'advanced', [
    ['x_catarsis', 'la catarsis', 'la ka-tar-sis', 'danh từ', 'sự giải tỏa cảm xúc qua nghệ thuật', 'El desenlace dramático ofreció a los espectadores una profunda catarsis.', 'El de-sen-la-se dra-ma-ti-ko o-fre-sio a los es-pek-ta-do-res u-na pro-fun-da ka-tar-sis.', 'Hồi kết kịch tính mang lại cho khán giả sự giải tỏa cảm xúc sâu lắng.'],
  ], 'health_hobby'),

  // ==================== 5. THẾ GIỚI HARRY POTTER & PHÉP THUẬT (magic — 20 từ) ====================
  ...buildPackLexicon('es', 1, 'beginner', [
    ['x_varita', 'la varita', 'la ba-ri-ta', 'danh từ', 'đũa phép', 'Todo joven mago aprende que la varita elige al mago.', 'To-do ho-ben ma-go a-pren-de ke la ba-ri-ta e-li-he al ma-go.', 'Mọi phù thủy trẻ đều học rằng chính đũa phép sẽ chọn chủ nhân.'],
    ['x_hechizo', 'el hechizo', 'el e-chi-so', 'danh từ', 'thần chú, câu bùa', 'Pronuncia bien cada sílaba antes de lanzar un hechizo de luz.', 'Pro-nun-sia bien ka-da si-la-ba an-tes de lan-sar un e-chi-so de lus.', 'Hãy phát âm rõ từng âm tiết trước khi niệm thần chú phát sáng.'],
  ], 'magic'),
  ...buildPackLexicon('es', 2, 'beginner', [
    ['x_escoba', 'la escoba voladora', 'la es-ko-ba bo-la-do-ra', 'danh từ', 'chổi bay phép thuật', 'Los alumnos de primer año practican equilibrio sobre su escoba voladora.', 'Los a-lum-nos de pri-mer a-nyo prak-ti-kan e-ki-li-brio so-bre su es-ko-ba bo-la-do-ra.', 'Học sinh năm nhất tập giữ thăng bằng trên chiếc chổi bay.'],
    ['x_pocion', 'la poción', 'la po-sion', 'danh từ', 'độc dược, thuốc phép', 'Remueve la poción plateada tres veces en sentido antihorario.', 'Re-mue-be la po-sion pla-te-a-da tres be-ses en sen-ti-do an-ti-o-ra-rio.', 'Khuấy bình độc dược ánh bạc ba vòng ngược chiều kim đồng hồ.'],
  ], 'magic'),
  ...buildPackLexicon('es', 3, 'beginner', [
    ['x_capa', 'la capa invisible', 'la ka-pa in-bi-si-ble', 'danh từ', 'áo choàng tàng hình', 'Se cubrió con la capa invisible al cruzar el pasillo nocturno.', 'Se ku-brio kon la ka-pa in-bi-si-ble al kru-sar el pa-si-yo nok-tur-no.', 'Cậu khoác chiếc áo choàng tàng hình khi băng qua hành lang đêm.'],
    ['x_castillo', 'el castillo', 'el kas-ti-yo', 'danh từ', 'lâu đài cổ kính', 'Las antorchas iluminan las altas torres de piedra del castillo.', 'Las an-tor-chas i-lu-mi-nan las al-tas to-rres de pie-dra del kas-ti-yo.', 'Ánh đuốc chiếu sáng những ngọn tháp đá cao của tòa lâu đài.'],
  ], 'magic'),
  ...buildPackLexicon('es', 4, 'intermediate', [
    ['x_patrono', 'el patrono', 'el pa-tro-no', 'danh từ', 'thần hộ mệnh', 'Piensa en tu recuerdo más feliz para invocar un patrono brillante.', 'Pien-sa en tu re-kuer-do mas fe-lis pa-ra in-bo-kar un pa-tro-no bri-yan-te.', 'Hãy nghĩ tới ký ức hạnh phúc nhất để triệu hồi thần hộ mệnh rực sáng.'],
    ['x_dormitorio', 'el dormitorio', 'el dor-mi-to-rio', 'danh từ', 'ký túc xá Nhà học viện', 'Nuestro dormitorio da al lago norte envuelto en niebla.', 'Nues-tro dor-mi-to-rio da al la-go nor-te en-buel-to en nie-bla.', 'Ký túc xá Nhà chúng tôi nhìn ra mặt hồ phía bắc phủ sương.'],
  ], 'magic'),
  ...buildPackLexicon('es', 5, 'intermediate', [
    ['x_profecia', 'la profecía', 'la pro-fe-si-a', 'danh từ', 'lời tiên tri', 'Una esfera de cristal luminosa guardaba una antigua profecía.', 'U-na es-fe-ra de kris-tal lu-mi-no-sa guar-da-ba u-na an-ti-gua pro-fe-si-a.', 'Quả cầu pha lê phát sáng lưu giữ một lời tiên tri cổ xưa.'],
    ['x_duelo', 'el duelo', 'el due-lo', 'danh từ', 'trận đấu tay đôi pháp thuật', 'Ambos capitanes hicieron una reverencia antes del duelo amistoso.', 'Am-bos ka-pi-ta-nes i-sie-ron u-na re-be-ren-sia an-tes del due-lo a-mis-to-so.', 'Cả hai đội trưởng cúi chào lịch thiệp trước trận đấu giao hữu.'],
  ], 'magic'),
  ...buildPackLexicon('es', 6, 'intermediate', [
    ['x_alquimia', 'la alquimia', 'la al-ki-mia', 'danh từ', 'thuật giả kim', 'Los eruditos estudiaban alquimia medieval en la sección prohibida.', 'Los e-ru-di-tos es-tu-dia-ban al-ki-mia me-die-bal en la sek-sion pro-i-bi-da.', 'Các học giả nghiên cứu thuật giả kim trung cổ trong khu vực cấm.'],
    ['x_director_esc', 'el rector mágico', 'el rek-tor ma-hi-ko', 'danh từ', 'hiệu trưởng học viện pháp thuật', 'El sabio rector mágico dio la bienvenida en el banquete inicial.', 'El sa-bio rek-tor ma-hi-ko dio la bien-be-ni-da en el ban-ke-te i-ni-sial.', 'Vị hiệu trưởng thông thái chào đón học sinh tại tiệc khai giảng.'],
  ], 'magic'),
  ...buildPackLexicon('es', 7, 'intermediate', [
    ['x_amuleto', 'el amuleto', 'el a-mu-le-to', 'danh từ', 'bùa hộ mệnh', 'Llevaba un amuleto plateado de fénix para proteger su viaje.', 'Ye-ba-ba un a-mu-le-to pla-te-a-do de fe-niks pa-ra pro-te-her su bia-he.', 'Cô đeo chiếc bùa hộ mệnh phượng hoàng bạc để bình an đường xa.'],
    ['x_grimorio', 'el grimorio', 'el gri-mo-rio', 'danh từ', 'sách thần chú cổ', 'Anotaciones a mano llenaban los márgenes del antiguo grimorio.', 'A-no-ta-sio-nes a ma-no ye-na-ban los mar-he-nes del an-ti-guo gri-mo-rio.', 'Những dòng ghi chú viết tay phủ kín lề quyển sách thần chú cổ.'],
  ], 'magic'),
  ...buildPackLexicon('es', 8, 'advanced', [
    ['x_transformacion', 'la transformación', 'la trans-for-ma-sion', 'danh từ', 'môn biến hình pháp thuật', 'La precisión mental resulta vital en la clase de transformación.', 'La pre-si-sion men-tal re-sul-ta bi-tal en la kla-se de trans-for-ma-sion.', 'Sự chuẩn xác trong tâm trí là cốt lõi của lớp Biến hình.'],
    ['x_conjuro', 'el conjuro', 'el kon-hu-ro', 'danh từ', 'câu niệm chú cổ ngữ', 'Un solo conjuro mal pronunciado convierte las chispas en humo.', 'Un so-lo kon-hu-ro mal pro-nun-sia-do kon-bier-te las chis-pas en u-mo.', 'Chỉ một câu niệm chú phát âm sai cũng biến tia lửa thành khói.'],
  ], 'magic'),
  ...buildPackLexicon('es', 9, 'advanced', [
    ['x_levitacion', 'la levitación', 'la le-bi-ta-sion', 'danh từ', 'bùa bay lơ lửng', 'Dominar el encanto de levitación exige un giro suave de muñeca.', 'Do-mi-nar el en-kan-to de le-bi-ta-sion ek-si-he un hi-ro sua-be de mu-nye-ka.', 'Làm chủ bùa bay lơ lửng đòi hỏi cú vẩy cổ tay thật mềm mại.'],
    ['x_aparicion', 'la aparición', 'la a-pa-ri-sion', 'danh từ', 'phép độn thổ, dịch chuyển tức thời', 'Todo mago debe aprobar un examen riguroso para practicar la aparición.', 'To-do ma-go de-be a-pro-bar un ek-sa-men ri-gu-ro-so pa-ra prak-ti-kar la a-pa-ri-sion.', 'Phù thủy phải đậu kỳ thi nghiêm ngặt mới được phép độn thổ.'],
  ], 'magic'),
  ...buildPackLexicon('es', 10, 'advanced', [
    ['x_clarividencia', 'la clarividencia', 'la kla-ri-bi-den-sia', 'danh từ', 'nhãn thông, năng lực thấu thị tiên tri', 'La auténtica clarividencia no surge simplemente al leer hojas de té.', 'La au-ten-ti-ka kla-ri-bi-den-sia no sur-he sim-ple-men-te al le-er o-has de te.', 'Khả năng thấu thị thực thụ không thể có chỉ qua việc xem lá trà.'],
    ['x_hechiceria', 'la hechicería', 'la e-chi-se-ri-a', 'danh từ', 'pháp thuật cổ đại, ma pháp cao cấp', 'Las crónicas relatan la hechicería protectora tejida en las murallas.', 'Las kro-ni-kas re-la-tan la e-chi-se-ri-a pro-tek-to-ra te-hi-da en las mu-ra-yas.', 'Biên niên sử chép về lớp pháp thuật bảo vệ dệt trong tường thành.'],
  ], 'magic'),
];

export const ES_EXPANDED_CURATED: CuratedQuizItem[] = [
  {
    id: 'es_x_daily_dial_1',
    lang: 'es',
    tier: 'beginner',
    levelBand: 2,
    topic: 'daily',
    format: 'dialogue_reply',
    promptVi: 'Bạn thân xin lỗi vì kẹt xe nên đến trễ — chọn câu đáp lại ấm áp nhất:',
    stemText: 'Amigo: "¡Perdón por llegar tarde! Había muchísimo tráfico."',
    stemPhonetic: 'Per-don por ye-gar tar-de! A-bi-a mu-chi-si-mo tra-fi-ko.',
    fullSentence: '¡No pasa nada, yo también acabo de llegar!',
    fullPhonetic: 'No pa-sa na-da, yo tam-bien a-ka-bo de ye-gar!',
    translationVi: 'Không sao đâu, mình cũng vừa mới tới thôi!',
    choices: [
      '¡No pasa nada, yo también acabo de llegar!',
      'El aeropuerto abre a las cinco.',
      'Guarda el recibo de la tienda.',
      'La biblioteca está cerrada hoy.',
    ],
    correctIndex: 0,
    grammarTitleVi: 'Cấu trúc vừa mới làm gì: acabar de + V nguyên mẫu',
    grammarExplainVi: '"No pasa nada" (Không sao đâu) kết hợp "acabo de llegar" (vừa mới tới) là cách đáp lại tự nhiên và thân thiện nhất trong tiếng Tây Ban Nha.',
    vocabNotes: [
      { word: 'no pasa nada', phonetic: 'no pa-sa na-da', posVi: 'cụm giao tiếp', meaningVi: 'không sao đâu' },
      { word: 'acabar de', phonetic: 'a-ka-bar de', posVi: 'cụm động từ', meaningVi: 'vừa mới xong' },
    ],
  },
  {
    id: 'es_x_travel_cloze_1',
    lang: 'es',
    tier: 'intermediate',
    levelBand: 4,
    topic: 'travel',
    format: 'grammar_cloze',
    promptVi: 'Chọn từ hỏi vị trí đúng để hỏi đường tới ga tàu điện ngầm:',
    stemText: 'Disculpe, ¿podría decirme ____ está la estación de metro más cercana?',
    stemPhonetic: 'Dis-kul-pe, po-dri-a de-sir-me ____ es-ta la es-ta-sion de me-tro mas ser-ka-na?',
    fullSentence: 'Disculpe, ¿podría decirme dónde está la estación de metro más cercana?',
    fullPhonetic: 'Dis-kul-pe, po-dri-a de-sir-me don-de es-ta la es-ta-sion de me-tro mas ser-ka-na?',
    translationVi: 'Xin lỗi, bạn có thể cho tôi biết ga tàu điện ngầm gần nhất ở đâu không?',
    choices: ['dónde', 'cuándo', 'quién', 'cuánto'],
    choicePhonetics: ['don-de', 'kuan-do', 'kien', 'kuan-to'],
    correctIndex: 0,
    grammarTitleVi: 'Hỏi vị trí lịch sự: ¿Podría decirme dónde está + Địa điểm?',
    grammarExplainVi: 'Dùng từ nghi vấn "dónde" (có dấu sắc) kết hợp động từ vị trí "está" để hỏi địa điểm lịch sự khi du lịch.',
    vocabNotes: [
      { word: 'dónde', phonetic: 'don-de', posVi: 'từ hỏi', meaningVi: 'ở đâu' },
      { word: 'más cercana', phonetic: 'mas ser-ka-na', posVi: 'tính từ', meaningVi: 'gần nhất' },
    ],
  },
  {
    id: 'es_x_tech_sent_1',
    lang: 'es',
    tier: 'intermediate',
    levelBand: 5,
    topic: 'study_tech',
    format: 'sentence_builder',
    promptVi: 'Sắp xếp các thẻ từ để nói: "Chúng ta phải hoàn thành bài thuyết trình trước hạn chót."',
    stemText: 'Chúng ta phải hoàn thành bài thuyết trình trước hạn chót.',
    fullSentence: 'Debemos terminar la presentación antes del plazo.',
    fullPhonetic: 'De-be-mos ter-mi-nar la pre-sen-ta-sion an-tes del pla-so.',
    translationVi: 'Chúng ta phải hoàn thành bài thuyết trình trước hạn chót.',
    orderedTokens: ['Debemos', 'terminar', 'la', 'presentación', 'antes', 'del', 'plazo.'],
    distractorTokens: ['después'],
    grammarTitleVi: 'Động từ nghĩa vụ deber + V nguyên mẫu & cụm antes del (trước)',
    grammarExplainVi: '"Debemos terminar" diễn tả trách nhiệm phải hoàn thành; "antes de + el" gộp bắt buộc thành "antes del plazo".',
    vocabNotes: [
      { word: 'la presentación', phonetic: 'la pre-sen-ta-sion', posVi: 'danh từ', meaningVi: 'bài thuyết trình' },
      { word: 'el plazo', phonetic: 'el pla-so', posVi: 'danh từ', meaningVi: 'hạn chót' },
    ],
  },
  {
    id: 'es_x_health_cloze_1',
    lang: 'es',
    tier: 'intermediate',
    levelBand: 6,
    topic: 'health_hobby',
    format: 'grammar_cloze',
    promptVi: 'Chọn giới từ chỉ mục đích rèn luyện sức bền:',
    stemText: 'Ella nada cada mañana ____ mejorar su resistencia física.',
    stemPhonetic: 'E-ya na-da ka-da ma-nya-na ____ me-ho-rar su re-sis-ten-sia fi-si-ka.',
    fullSentence: 'Ella nada cada mañana para mejorar su resistencia física.',
    fullPhonetic: 'E-ya na-da ka-da ma-nya-na pa-ra me-ho-rar su re-sis-ten-sia fi-si-ka.',
    translationVi: 'Cô ấy bơi mỗi sáng để cải thiện sức bền thể chất của mình.',
    choices: ['para', 'pero', 'sino', 'hacia'],
    choicePhonetics: ['pa-ra', 'pe-ro', 'si-no', 'a-sia'],
    correctIndex: 0,
    grammarTitleVi: 'Giới từ chỉ mục đích: para + Động từ nguyên mẫu (để làm gì)',
    grammarExplainVi: 'Trước động từ nguyên mẫu "mejorar" diễn tả mục đích hành động, tiếng Tây Ban Nha luôn dùng "para" (không dùng "por").',
    vocabNotes: [
      { word: 'para', phonetic: 'pa-ra', posVi: 'giới từ', meaningVi: 'để (chỉ mục đích)' },
      { word: 'la resistencia', phonetic: 'la re-sis-ten-sia', posVi: 'danh từ', meaningVi: 'sức bền' },
    ],
  },
  {
    id: 'es_x_magic_cloze_1',
    lang: 'es',
    tier: 'advanced',
    levelBand: 8,
    topic: 'magic',
    format: 'grammar_cloze',
    promptVi: 'Chọn cặp liên từ tăng tiến chuẩn DELE C1 về phép thuật Hogwarts:',
    stemText: 'No solo pronunció el conjuro con precisión, ____ también dominó la magia silenciosa.',
    stemPhonetic: 'No so-lo pro-nun-sio el kon-hu-ro kon pre-si-sion, ____ tam-bien do-mi-no la ma-hia si-len-sio-sa.',
    fullSentence: 'No solo pronunció el conjuro con precisión, sino que también dominó la magia silenciosa.',
    fullPhonetic: 'No so-lo pro-nun-sio el kon-hu-ro kon pre-si-sion, si-no ke tam-bien do-mi-no la ma-hia si-len-sio-sa.',
    translationVi: 'Cô ấy không chỉ niệm câu chú chuẩn xác mà còn làm chủ cả phép thuật không lời.',
    choices: ['sino que', 'aunque', 'mientras', 'por eso'],
    choicePhonetics: ['si-no ke', 'aun-ke', 'mien-tras', 'por e-so'],
    correctIndex: 0,
    grammarTitleVi: 'Liên từ tăng tiến với 2 mệnh đề có động từ chia: No solo ..., sino que también ...',
    grammarExplainVi: 'Khi vế sau có động từ chia ("dominó"), bắt buộc dùng "sino que también" thay vì chỉ "sino también".',
    vocabNotes: [
      { word: 'el conjuro', phonetic: 'el kon-hu-ro', posVi: 'danh từ', meaningVi: 'câu niệm chú' },
      { word: 'sino que', phonetic: 'si-no ke', posVi: 'liên từ', meaningVi: 'mà còn (+ mệnh đề)' },
    ],
  },
];
