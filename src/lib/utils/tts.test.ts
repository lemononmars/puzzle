import { describe, it, expect } from 'vitest';
import { preprocessThaiTTSText } from './tts';

describe('TTS Preprocessing & Phonetic Mapping for Thai Speech Synthesis', () => {

	it('should convert scientific formulas and units into spoken Thai', () => {
		expect(preprocessThaiTTSText('สมการ E=mc² ของไอน์สไตน์')).toContain('อี เท่ากับ เอ็มซี กำลังสอง');
		expect(preprocessThaiTTSText('ก๊าซ CO2 และ H2O ในบรรยากาศ')).toContain('คาร์บอนไดออกไซด์');
		expect(preprocessThaiTTSText('ก๊าซ CO2 และ H2O ในบรรยากาศ')).toContain('เอชทูโอ');
		expect(preprocessThaiTTSText('ฝุ่น PM 2.5 มีผลต่อสุขภาพ')).toContain('พีเอ็ม สองจุดห้า');
		expect(preprocessThaiTTSText('ความเร็ว 120 km/h')).toContain('กิโลเมตรต่อชั่วโมง');
		expect(preprocessThaiTTSText('อุณหภูมิ 37 °C')).toContain('องศาเซลเซียส');
		expect(preprocessThaiTTSText('เกลือแกงคือ NaCl')).toContain('โซเดียมคลอไรด์ หรือ เกลือแกง');
		expect(preprocessThaiTTSText('กรดซัลฟิวริก H2SO4')).toContain('กรดซัลฟิวริก');
	});

	it('should convert space missions, telescopes and organizations', () => {
		expect(preprocessThaiTTSText('กล้องโทรทรรศน์ JWST และ Hubble')).toContain('เจดับเบิลยูเอสที');
		expect(preprocessThaiTTSText('กล้องโทรทรรศน์ JWST และ Hubble')).toContain('ฮับเบิล');
		expect(preprocessThaiTTSText('สถานีอวกาศ ISS สังกัด NASA และ ESA')).toContain('ไอเอสเอส');
		expect(preprocessThaiTTSText('สถานีอวกาศ ISS สังกัด NASA และ ESA')).toContain('นาซา');
		expect(preprocessThaiTTSText('สถานีอวกาศ ISS สังกัด NASA และ ESA')).toContain('อีเอสเอ');
		expect(preprocessThaiTTSText('จรวด Falcon 9 ของ SpaceX')).toContain('ฟอลคอน ไนน์');
		expect(preprocessThaiTTSText('จรวด Falcon 9 ของ SpaceX')).toContain('สเปซเอ็กซ์');
	});

	it('should convert tech and AI terminology', () => {
		expect(preprocessThaiTTSText('ระบบ ChatGPT พัฒนาโดย OpenAI')).toContain('แชตจีพีที');
		expect(preprocessThaiTTSText('ระบบ ChatGPT พัฒนาโดย OpenAI')).toContain('โอเพนเอไอ');
		expect(preprocessThaiTTSText('การ์ดจอ GPU และ ซีพียู CPU')).toContain('จีพียู');
		expect(preprocessThaiTTSText('การ์ดจอ GPU และ ซีพียู CPU')).toContain('ซีพียู');
		expect(preprocessThaiTTSText('สัญญาณ Wi-Fi 6 และ 5G')).toContain('ไวไฟ หก');
		expect(preprocessThaiTTSText('สัญญาณ Wi-Fi 6 และ 5G')).toContain('ไฟว์จี');
	});

	it('should convert anime, manga, and game titles', () => {
		expect(preprocessThaiTTSText('อนิเมะ One Piece และ Attack on Titan')).toContain('วันพีซ');
		expect(preprocessThaiTTSText('อนิเมะ One Piece และ Attack on Titan')).toContain('ผ่าพิภพไททัน');
		expect(preprocessThaiTTSText('เกม Genshin Impact และ Elden Ring')).toContain('เกนชิน อิมแพกต์');
		expect(preprocessThaiTTSText('เกม Genshin Impact และ Elden Ring')).toContain('เอลเดน ริง');
		expect(preprocessThaiTTSText('ยาพิษ APTX 4869 ในเรื่อง Detective Conan')).toContain('เอพีทีเอ็กซ์ สี่แปดหกเก้า');
		expect(preprocessThaiTTSText('ยาพิษ APTX 4869 ในเรื่อง Detective Conan')).toContain('ยอดนักสืบจิ๋วโคนัน');
		expect(preprocessThaiTTSText('สตูดิโอ Studio Ghibli สร้าง Spirited Away')).toContain('สตูดิโอ จิบลิ');
		expect(preprocessThaiTTSText('เกม NieR:Automata ตัวละคร 2B')).toContain('เนียร์ ออโตมาตา');
		expect(preprocessThaiTTSText('เกม NieR:Automata ตัวละคร 2B')).toContain('ทูบี');
	});

	it('should convert global cinema, music, geography and historical terms', () => {
		expect(preprocessThaiTTSText('ภาพยนตร์ Avengers: Endgame และ Oppenheimer')).toContain('อเวนเจอร์ส เอนด์เกม');
		expect(preprocessThaiTTSText('ภาพยนตร์ Avengers: Endgame และ Oppenheimer')).toContain('ออปเพนไฮเมอร์');
		expect(preprocessThaiTTSText('วงดนตรี BLACKPINK และ Queen')).toContain('แบล็กพิงก์');
		expect(preprocessThaiTTSText('วงดนตรี BLACKPINK และ Queen')).toContain('วงควีน');
		expect(preprocessThaiTTSText('สถานที่ Mount Everest และ Grand Canyon')).toContain('ยอดเขาเอเวอเรสต์');
		expect(preprocessThaiTTSText('สถานที่ Mount Everest และ Grand Canyon')).toContain('แกรนด์แคนยอน');
		expect(preprocessThaiTTSText('สงคราม World War II และ กษัตริย์ King Charles III')).toContain('สงครามโลกครั้งที่สอง');
		expect(preprocessThaiTTSText('สงคราม World War II และ กษัตริย์ King Charles III')).toContain('คิง ชาร์ลส์ ที่สาม');
	});
});
