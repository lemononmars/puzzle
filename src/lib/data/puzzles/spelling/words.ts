export interface WordItem {
	correct: string;
	incorrect: string[];
	explanation: string;
	isLoanWord: boolean;
}

export const wordDatabase: WordItem[] = [
	{
		correct: 'ก็',
		incorrect: ['ก้อ'],
		explanation: '',
		isLoanWord: false
	},
	{
		correct: 'กงเกวียนกำเกวียน',
		incorrect: ['กงกำกงเกวียน', 'กงกรรมกงเกวียน'],
		explanation: 'กง และ กำ เป็นส่วนประกอบของล้อเกวียน',
		isLoanWord: false
	},
	{
		correct: 'กงสุล',
		incorrect: ['กงศุล'],
		explanation: 'มาจากคำในภาษาฝรั่งเศสว่า "consul"',
		isLoanWord: true
	},
	{
		correct: 'กฎ',
		incorrect: ['กฏ'],
		explanation: 'ยกเว้น ปรากฏ, ทุกกฏ ใช้ ฏ ปฏัก ส่วน กรกฎ, กรกฏ สะกดได้ทั้งสองแบบ',
		isLoanWord: false
	},
	{
		correct: 'กบฏ',
		incorrect: ['กบฎ', 'กบถ'],
		explanation:
			'- "กบฏ" ใช้ ฏ ปฏัก- ในสมัยโบราณ เคยสะกดด้วย ฎ ชฎา (ดู พจนานุกรมกฎหมาย ของ ขุนสมาหารหิตะคดี)- ถ้าออกเสียง "ขะ-บด" เขียน "ขบถ"',
		isLoanWord: false
	},
	{
		correct: 'กบาล',
		incorrect: ['กะบาล', 'กะบาน'],
		explanation: 'สะกด "กระบาล" ได้',
		isLoanWord: false
	},
	{
		correct: 'กระเชอ',
		incorrect: ['กระเฌอ', 'กะเชอ', 'กะเฌอ'],
		explanation: 'ระวังสับสนกับ เฌอ',
		isLoanWord: false
	},
	{
		correct: 'กระเพาะ',
		incorrect: ['กะเพาะ', 'กะเพราะ', 'กระเพราะ'],
		explanation: 'ระวังสับสนกับ กะเพรา',
		isLoanWord: false
	},
	{
		correct: 'คำกริยา',
		incorrect: ['คำกิริยา'],
		explanation: 'คำชนิดหนึ่ง บอกอาการ การกระทำ',
		isLoanWord: false
	},
	{
		correct: 'กีฬากรีฑา',
		incorrect: ['กีฬากรีธา', 'กีฬากรีทา'],
		explanation: 'กีฬาประเภทหนึ่ง',
		isLoanWord: false
	},
	{
		correct: 'กรีธาทัพ',
		incorrect: ['กรีฑาทัพ'],
		explanation: 'เคลื่อน ยก เดินเป็นหมู่หรือเป็นกระบวน',
		isLoanWord: false
	},
	{
		correct: 'กลยุทธ์',
		incorrect: ['กลยุทธ', 'กลยุทธิ', 'กลยุทธิ์'],
		explanation: '',
		isLoanWord: false
	},
	{
		correct: 'กลางคัน',
		incorrect: ['กลางครัน'],
		explanation: '',
		isLoanWord: false
	},
	{
		correct: 'กลิ่นอาย',
		incorrect: ['กลิ่นไอ'],
		explanation: 'อาย แปลว่า กลิ่น จึงเป็นคำซ้อน',
		isLoanWord: false
	},
	{
		correct: 'กสิณ',
		incorrect: ['กสิน'],
		explanation: '',
		isLoanWord: false
	},
	{
		correct: 'กเฬวราก',
		incorrect: ['กเลวราก'],
		explanation: '',
		isLoanWord: false
	},
	{
		correct: 'กอปร',
		incorrect: ['กอป', 'กอปร์'],
		explanation: 'อ่านว่า "กอบ"',
		isLoanWord: false
	},
	{
		correct: 'กอล์ฟ',
		incorrect: ['กลอฟ', 'กอลฟ์', 'ก็อลฟ์', 'ก็อล์ฟ', 'ก๊อลฟ์', 'ก๊อล์ฟ'],
		explanation: '',
		isLoanWord: true
	},
	{
		correct: 'กะทันหัน',
		incorrect: ['กระทันหัน'],
		explanation: '',
		isLoanWord: false
	},
	{
		correct: 'กะเทย',
		incorrect: ['กระเทย'],
		explanation: '',
		isLoanWord: false
	},
	{
		correct: 'กะเทาะ',
		incorrect: ['กระเทาะ'],
		explanation: '',
		isLoanWord: false
	},
	{
		correct: 'กะบังลม',
		incorrect: ['กระบังลม'],
		explanation: '',
		isLoanWord: false
	},
	{
		correct: 'กะปิ',
		incorrect: ['กระปิ'],
		explanation: '',
		isLoanWord: false
	},
	{
		correct: 'กะพง',
		incorrect: ['กระพง'],
		explanation: '',
		isLoanWord: false
	},
	{
		correct: 'กะพริบ',
		incorrect: ['กระพริบ'],
		explanation: '',
		isLoanWord: false
	},
	{
		correct: 'กะพรุน',
		incorrect: ['กระพรุน'],
		explanation: '',
		isLoanWord: false
	},
	{
		correct: 'กะเพรา',
		incorrect: ['กะเพา', 'กระเพา', 'กระเพรา'],
		explanation: 'ระวังสับสนกับ กระเพาะ',
		isLoanWord: false
	},
	{
		correct: 'กะล่อน',
		incorrect: ['กระล่อน'],
		explanation: '',
		isLoanWord: false
	},
	{
		correct: 'กะละมัง',
		incorrect: ['กาละมัง'],
		explanation: '',
		isLoanWord: false
	},
	{
		correct: 'กะลาสี',
		incorrect: ['กลาสี'],
		explanation: '',
		isLoanWord: false
	},
	{
		correct: 'กะละแม',
		incorrect: ['กาละแม', 'กาลาแม', 'กาละแมร์'],
		explanation: '',
		isLoanWord: false
	},
	{
		correct: 'กะหรี่',
		incorrect: ['กระหรี่'],
		explanation: '',
		isLoanWord: false
	},
	{
		correct: 'กะเหรี่ยง',
		incorrect: ['กระเหรี่ยง'],
		explanation: '',
		isLoanWord: false
	},
	{
		correct: 'กะหล่ำ',
		incorrect: ['กระหล่ำ'],
		explanation: '',
		isLoanWord: false
	},
	{
		correct: 'กะโหลก',
		incorrect: ['กระโหลก'],
		explanation: 'จำไว้ว่า "กะโหลกกะลา"',
		isLoanWord: false
	},
	{
		correct: 'กังวาน',
		incorrect: ['กังวาล'],
		explanation: '',
		isLoanWord: false
	},
	{
		correct: 'กาลเทศะ',
		incorrect: ['กาละเทศะ'],
		explanation: '',
		isLoanWord: false
	},
	{
		correct: 'กาลเวลา',
		incorrect: ['กาฬเวลา'],
		explanation: 'กาล หมายถึง เวลา  แต่ กาฬ หมายถึง รอยดำหรือแดง',
		isLoanWord: false
	},
	{
		correct: 'กำเหน็จ',
		incorrect: ['กำเหน็ด'],
		explanation: '',
		isLoanWord: false
	},
	{
		correct: 'กิตติมศักดิ์',
		incorrect: ['กิติมศักดิ์', 'เกียรติมศักดิ์'],
		explanation: '',
		isLoanWord: false
	},
	{
		correct: 'กินรี',
		incorrect: ['กินนรี'],
		explanation: 'แต่ "กิน-นอน" เขียน กินนร',
		isLoanWord: false
	},
	{
		correct: 'กิริยา',
		incorrect: ['กริยา'],
		explanation: 'อาการ การกระทำ เช่น ปฏิกิริยา',
		isLoanWord: false
	},
	{
		correct: 'กุฎี',
		incorrect: ['กุฎ', 'กุฎิ'],
		explanation: 'กุฏิ อ่านว่า "กุด" หรือ "กุ-ติ" หรือ "กุด-ติ", สะกด "กุฏิ" ได้',
		isLoanWord: false
	},
	{
		correct: 'เกม',
		incorrect: ['เกมส์'],
		explanation:
			'ในภาษาไทยสำหรับกรณีทั่วไปจะไม่มีการเปลี่ยนรูปแบบคำใดๆ ทั้งสิ้น ไม่ว่าสื่อความหมายถึงเอกพจน์หรือพหูพจน์เว้นแต่เป็นการทับศัพท์วิสามานยนาม เช่น "SEA Games" ว่า ซีเกมส์',
		isLoanWord: true
	},
	{
		correct: 'เกล็ดเลือด',
		incorrect: ['เกร็ดเลือด'],
		explanation: '',
		isLoanWord: false
	},
	{
		correct: 'เกษียณ',
		incorrect: ['เกษียน', 'เกษียร'],
		explanation: 'เกษียณ = สิ้นไป เช่นเกษียณอายุ; เกษียน = เขียน; เกษียร = น้ำนม',
		isLoanWord: false
	},
	{
		correct: 'เกสร',
		incorrect: ['เกษร'],
		explanation: 'ส่วนในของดอกไม้',
		isLoanWord: false
	},
	{
		correct: 'เกาต์',
		incorrect: ['เก๊าท์'],
		explanation: '',
		isLoanWord: true
	},
	{
		correct: 'เกียรติ',
		incorrect: ['เกียรติ์'],
		explanation: 'อ่านว่า "เกียด", ถ้าเขียน เกียรติ์ อ่านว่า "เกียน" เช่น รามเกียรติ์',
		isLoanWord: false
	},
	{
		correct: 'แก๊ง',
		incorrect: ['แก๊งค์', 'แก๊งก์'],
		explanation:
			'"แก๊ง" มาจากภาษาอังกฤษว่า "gang" ในภาษาไทยเป็นภาษาปาก หมายความว่า "กลุ่มคนที่ตั้งเป็นก๊กเป็นเหล่า (มักใช้ในความหมายไม่ดี) เช่น แก๊งโจร แก๊งอันธพาล"',
		isLoanWord: true
	},
	{
		correct: 'แกร็น',
		incorrect: ['แกน', 'แกรน'],
		explanation: 'ไม่เจริญเติบโตตามปรกติ (ใช้แก่คน สัตว์ และพืช), เช่น แคระแกร็น',
		isLoanWord: false
	},
	{
		correct: 'ขบถ',
		incorrect: ['ขบฏ'],
		explanation: 'ดู กบฏ',
		isLoanWord: false
	},
	{
		correct: 'ขโมย',
		incorrect: ['โขมย'],
		explanation: '',
		isLoanWord: false
	},
	{
		correct: 'ขวาน',
		incorrect: ['ขวาญ'],
		explanation: '',
		isLoanWord: false
	},
	{
		correct: 'ขะมักเขม้น',
		incorrect: ['ขมักเขม้น'],
		explanation: '',
		isLoanWord: false
	},
	{
		correct: 'ขาดดุล',
		incorrect: ['ขาดดุลย์'],
		explanation: 'ดู "ดุล", "สมดุล"',
		isLoanWord: false
	},
	{
		correct: 'ข้าวเหนียวมูน',
		incorrect: ['ข้าวเหนียวมูล'],
		explanation: 'มูน = เอากะทิเคล้ากับข้าวเหนียวเพื่อให้มัน',
		isLoanWord: false
	},
	{
		correct: 'ขี้เกียจ',
		incorrect: ['ขี้เกลียด', 'ขี้เกียด'],
		explanation: '',
		isLoanWord: false
	},
	{
		correct: 'ไข่มุก',
		incorrect: ['ไข่มุกด์', 'ไข่มุข'],
		explanation: '',
		isLoanWord: false
	},
	{
		correct: 'คทา',
		incorrect: ['คฑา', 'คธา'],
		explanation: '',
		isLoanWord: false
	},
	{
		correct: 'คน',
		incorrect: ['ฅน'],
		explanation: 'ฅ ในอดีตไม่เคยใช้เขียนคำว่า ฅน แต่ในปัจจุบันอาจมีการใช้บ้างในบันเทิงคดี',
		isLoanWord: false
	},
	{
		correct: 'ครรไล',
		incorrect: ['ครรลัย'],
		explanation: '',
		isLoanWord: false
	},
	{
		correct: 'ครองราชย์',
		incorrect: ['ครองราช'],
		explanation:
			'ราชย์ หมายถึง ความเป็นราชา, ครองราชย์ จึงหมายถึง ครองความเป็นราชาทั้งนี้ คำว่า "ครองราชสมบัติ" หมายความว่า ครองสมบัติของพระราชา ก็คือ ครองความเป็นราชา (มิใช่ "ครองราชยสมบัติ" อันแปลว่า ครองสมบัติแห่งความเป็นพระราชา)',
		isLoanWord: false
	},
	{
		correct: 'คริสตกาล',
		incorrect: ['คริสต์กาล'],
		explanation: 'ใช้ตามโบราณ',
		isLoanWord: false
	},
	{
		correct: 'คริสตจักร',
		incorrect: ['คริสต์จักร'],
		explanation: 'ใช้ตามโบราณ',
		isLoanWord: false
	},
	{
		correct: 'คริสต์ทศวรรษ',
		incorrect: ['คริสตทศวรรษ'],
		explanation: 'ไม่นิยมสมาสข้ามภาษา',
		isLoanWord: false
	},
	{
		correct: 'คริสต์ศตวรรษ',
		incorrect: ['คริสตศตวรรษ'],
		explanation: 'ไม่นิยมสมาสข้ามภาษา',
		isLoanWord: false
	},
	{
		correct: 'คริสต์ศักราช',
		incorrect: ['คริสตศักราช'],
		explanation: '',
		isLoanWord: false
	},
	{
		correct: 'คริสต์ศาสนา',
		incorrect: ['คริสตศาสนา'],
		explanation: 'ไม่นิยมสมาสข้ามภาษา',
		isLoanWord: false
	},
	{
		correct: 'คริสต์ศาสนิกชน',
		incorrect: ['คริสตศาสนิกชน'],
		explanation: '',
		isLoanWord: false
	},
	{
		correct: 'คริสต์มาส',
		incorrect: ['คริสตมาส'],
		explanation: '',
		isLoanWord: true
	},
	{
		correct: 'ครุฑ',
		incorrect: ['ครุท'],
		explanation: '',
		isLoanWord: false
	},
	{
		correct: 'ครุภัณฑ์',
		incorrect: ['คุรุภัณฑ์'],
		explanation: '',
		isLoanWord: false
	},
	{
		correct: 'ครุศาสตร์',
		incorrect: ['คุรุศาสตร์'],
		explanation: '',
		isLoanWord: false
	},
	{
		correct: 'คฤหาสน์',
		incorrect: ['คฤหาสถ์'],
		explanation: 'คฤห + อาสน',
		isLoanWord: false
	},
	{
		correct: 'คลิก',
		incorrect: ['คลิ้ก', 'คลิ๊ก'],
		explanation: '',
		isLoanWord: true
	},
	{
		correct: 'คลินิก',
		incorrect: ['คลีนิก', 'คลินิค'],
		explanation: '',
		isLoanWord: true
	},
	{
		correct: 'ค้อน',
		incorrect: ['ฆ้อน'],
		explanation: '',
		isLoanWord: false
	},
	{
		correct: 'คะ',
		incorrect: ['ค๊ะ'],
		explanation: '',
		isLoanWord: false
	},
	{
		correct: 'คะนอง',
		incorrect: ['คนอง'],
		explanation: '',
		isLoanWord: false
	},
	{
		correct: 'คาร์ป',
		incorrect: ['คาร์ฟ', 'คราฟ', 'คาร์พ', 'คราพ'],
		explanation: 'ชื่อปลา ทับศัพท์มาจาก carp',
		isLoanWord: true
	},
	{
		correct: 'คารวะ',
		incorrect: ['เคารวะ', 'คาราวะ', 'คราวะ'],
		explanation: '',
		isLoanWord: false
	},
	{
		correct: 'คำนวณ',
		incorrect: ['คำนวน'],
		explanation: '',
		isLoanWord: false
	},
	{
		correct: 'คำสดุดี',
		incorrect: ['คำดุษฎี'],
		explanation: '',
		isLoanWord: false
	},
	{
		correct: 'คุกกี้',
		incorrect: ['คุ้กกี้', 'คุ๊กกี้'],
		explanation: 'ออกเสียง คุก โดยไม่ต้องใส่วรรณยุกต์',
		isLoanWord: true
	},
	{
		correct: 'คุรุศึกษา',
		incorrect: ['ครุศึกษา'],
		explanation: '',
		isLoanWord: false
	},
	{
		correct: 'เค้ก',
		incorrect: ['เค็ก', 'เค๊ก'],
		explanation: '',
		isLoanWord: true
	},
	{
		correct: 'เครื่องราง',
		incorrect: ['เครื่องลาง'],
		explanation: '',
		isLoanWord: false
	},
	{
		correct: 'แค็ตตาล็อก',
		incorrect: ['แคตตาล็อก', 'แคตาล็อก'],
		explanation: '',
		isLoanWord: true
	},
	{
		correct: 'แคระแกร็น',
		incorrect: ['แคะแกน', 'แคะแกรน', 'แคระแกน', 'แคระแกรน'],
		explanation: 'ไม่เจริญเติบโตตามปรกติ (ใช้แก่คน สัตว์ และพืช)',
		isLoanWord: false
	},
	{
		correct: 'โค่ง',
		incorrect: ['โข่ง'],
		explanation: 'โค่ง = โตกว่าเพื่อน, โข่ง = เปิ่น ไม่เข้าท่า',
		isLoanWord: false
	},
	{
		correct: 'โคตร',
		incorrect: ['โครต', 'โคต', 'โคด'],
		explanation: '',
		isLoanWord: false
	},
	{
		correct: 'โครงการ',
		incorrect: ['โครงการณ์'],
		explanation: 'การ หมายถึง งาน',
		isLoanWord: false
	},
	{
		correct: 'โควตา',
		incorrect: ['โควต้า'],
		explanation: 'ออกเสียง คว ควบกล้ำ และออกเสียง ต้า โดยไม่ต้องใส่วรรณยุกต์',
		isLoanWord: false
	},
	{
		correct: 'คอลัมน์',
		incorrect: ['คอลัมม์'],
		explanation: '',
		isLoanWord: true
	},
	{
		correct: 'ฆราวาส',
		incorrect: ['ฆรวาส', 'ฆารวาส', '-วาท'],
		explanation: '',
		isLoanWord: false
	},
	{
		correct: 'ฆาตกร',
		incorrect: ['ฆาตรกร'],
		explanation: 'ฆาต แปลว่า ฆ่า, ทำลาย หรือ ตี',
		isLoanWord: false
	},
	{
		correct: 'ฆาตกรรม',
		incorrect: ['ฆาตรกรรม'],
		explanation: 'ฆาต แปลว่า ฆ่า, ทำลาย หรือ ตี',
		isLoanWord: false
	},
	{
		correct: 'เฆี่ยน',
		incorrect: ['เคี่ยน'],
		explanation: 'ตีด้วยหวายหรือไม้เรียวเป็นต้นเป็นการลงโทษ เป็นต้น',
		isLoanWord: false
	},
	{
		correct: 'งบดุล',
		incorrect: ['งบดุลย์'],
		explanation: 'ไม่ใช่ ดุลย์',
		isLoanWord: false
	},
	{
		correct: 'งูสวัด',
		incorrect: ['งูสวัส', 'งูสวัสดิ์'],
		explanation: '',
		isLoanWord: false
	},
	{
		correct: 'จงกรม',
		incorrect: ['จงกลม'],
		explanation: 'การฝึกสมาธิ',
		isLoanWord: false
	},
	{
		correct: 'จระเข้',
		incorrect: ['จรเข้'],
		explanation: 'ยกเว้นชื่อ จรเข้บัว, ส่วนเครื่องดนตรีไทย เรียก จะเข้',
		isLoanWord: false
	},
	{
		correct: 'จลนศาสตร์',
		incorrect: ['จลศาสตร์'],
		explanation: '',
		isLoanWord: false
	},
	{
		correct: 'จลาจล',
		incorrect: ['จราจล'],
		explanation: 'มาจากคำ จล + อจล',
		isLoanWord: false
	},
	{
		correct: 'จะงอย',
		incorrect: ['จงอย'],
		explanation: '',
		isLoanWord: false
	},
	{
		correct: 'จะจะ',
		incorrect: ['จะๆ'],
		explanation: 'คำมูลสองพยางค์',
		isLoanWord: false
	},
	{
		correct: 'จะละเม็ด',
		incorrect: ['จาละเม็ด', 'จาระเม็ด', 'จรเม็ด', 'จระเม็ด'],
		explanation: '',
		isLoanWord: false
	},
	{
		correct: 'จักจั่น',
		incorrect: ['จั๊กจั่น'],
		explanation: '',
		isLoanWord: false
	},
	{
		correct: 'จักร',
		incorrect: ['จักร์'],
		explanation: '',
		isLoanWord: false
	},
	{
		correct: 'จักรพรรดิ',
		incorrect: ['จักรพรรดิ์'],
		explanation: 'อ่านว่า "จัก-กฺระ-พัด"',
		isLoanWord: false
	},
	{
		correct: 'จักรวรรดิ',
		incorrect: ['จักรวรรดิ์'],
		explanation: 'อ่านว่า "จัก-กฺระ-หวัด"',
		isLoanWord: false
	},
	{
		correct: 'จักสาน',
		incorrect: ['จักรสาน'],
		explanation: 'เครื่องใช้ที่ทำด้วยมือ',
		isLoanWord: false
	},
	{
		correct: 'จาระไน',
		incorrect: ['จารไน'],
		explanation: '',
		isLoanWord: false
	},
	{
		correct: 'จาระบี',
		incorrect: ['จารบี'],
		explanation: '',
		isLoanWord: false
	},
	{
		correct: 'จำนง',
		incorrect: ['จำนงค์'],
		explanation: 'แผลงจาก จง',
		isLoanWord: false
	},
	{
		correct: 'จินตนาการ',
		incorrect: ['จินตะนาการ', 'จินตรนาการ'],
		explanation: '',
		isLoanWord: false
	},
	{
		correct: 'จุฬาลงกรณ์มหาวิทยาลัย',
		incorrect: ['จุฬาลงกรณมหาวิทยาลัย'],
		explanation: 'ปัจจุบันใช้แบบมีทัณฑฆาต',
		isLoanWord: false
	},
	{
		correct: 'เจตจำนง',
		incorrect: ['เจตจำนงค์'],
		explanation: 'แผลงจาก จง',
		isLoanWord: false
	},
	{
		correct: 'เจียระไน',
		incorrect: ['เจียรไน'],
		explanation: '',
		isLoanWord: false
	},
	{
		correct: 'โจทก์จำเลย',
		incorrect: ['โจทย์จำเลย'],
		explanation: 'โจทก์ หมายถึง ผู้ฟ้องร้องในศาลกล่าวหาจำเลย, โจทย์ หมายถึง ปัญหา เช่น โจทย์เลข',
		isLoanWord: false
	},
	{
		correct: 'ใจ',
		incorrect: ['จัย'],
		explanation: '',
		isLoanWord: false
	},
	{
		correct: 'ฉบับ',
		incorrect: ['ฉะบับ'],
		explanation: '',
		isLoanWord: false
	},
	{
		correct: 'ฉะนั้น',
		incorrect: ['ฉนั้น'],
		explanation: '',
		isLoanWord: false
	},
	{
		correct: 'ฉะนี้',
		incorrect: ['ฉนี้'],
		explanation: '',
		isLoanWord: false
	},
	{
		correct: 'ฉัน',
		incorrect: ['ฉันท์'],
		explanation: 'เสมือน เช่น ฉันญาติ ฉันมิตร; รับประทาน ใช้กับพระสงฆ์',
		isLoanWord: false
	},
	{
		correct: 'ฉันท์',
		incorrect: ['ฉัน'],
		explanation: 'ความพอใจ หรือร้อยกรองประเภทหนึ่งมีบังคับครุลหุ',
		isLoanWord: false
	},
	{
		correct: 'เฉพาะ',
		incorrect: ['ฉะเพาะ', 'ฉเพาะ'],
		explanation: '',
		isLoanWord: false
	},
	{
		correct: 'ไฉน',
		incorrect: ['ฉไน'],
		explanation: '',
		isLoanWord: false
	},
	{
		correct: 'ชมพู',
		incorrect: ['ชมภู'],
		explanation: 'สีแดงผสมสีขาว',
		isLoanWord: false
	},
	{
		correct: 'ชมพู่',
		incorrect: ['ชมภู่'],
		explanation: 'ชื่อผลไม้',
		isLoanWord: false
	},
	{
		correct: 'ชลมารค',
		incorrect: ['ชลมาค', 'ชลมาคร', 'ชลมาร์ค'],
		explanation: 'หมายถึง ทางนํ้า เช่น กระบวนเสด็จพระราชดำเนินโดยทางชลมารค',
		isLoanWord: false
	},
	{
		correct: 'ช็อกโกแลต',
		incorrect: ['ชอกโกเลต', 'ช๊อกโกเลต', 'ชอคโกเลต', 'ช๊อคโกเลต', 'ช็อคโกเลต', 'ช็อกโกแล็ต'],
		explanation: 'ตามพจนานุกรม ฉบับราชบัณฑิตยสถาน พ.ศ. 2554',
		isLoanWord: true
	},
	{
		correct: 'ชอุ่ม',
		incorrect: ['ชะอุ่ม'],
		explanation: '',
		isLoanWord: false
	},
	{
		correct: 'ชะนี',
		incorrect: ['ชนี'],
		explanation: '',
		isLoanWord: false
	},
	{
		correct: 'ชะมด',
		incorrect: ['ชมด'],
		explanation: '',
		isLoanWord: false
	},
	{
		correct: 'ชะลอ',
		incorrect: ['ชลอ'],
		explanation: '',
		isLoanWord: false
	},
	{
		correct: 'ชัชวาล',
		incorrect: ['ชัชวาลย์'],
		explanation: '',
		isLoanWord: false
	},
	{
		correct: 'ชีวประวัติ',
		incorrect: ['ชีวะประวัติ'],
		explanation: 'สมาสแล้วลบวิสรรชนีย์',
		isLoanWord: false
	},
	{
		correct: 'ซวดเซ',
		incorrect: ['ทรวดเซ'],
		explanation: '',
		isLoanWord: false
	},
	{
		correct: 'ซ่องเสพ',
		incorrect: ['ส้องเสพ'],
		explanation: '',
		isLoanWord: false
	},
	{
		correct: 'ซอฟต์แวร์',
		incorrect: ['ซอฟท์แวร์'],
		explanation: 'ทับศัพท์มาจาก software',
		isLoanWord: true
	},
	{
		correct: 'ซาบซ่าน',
		incorrect: ['ทราบซ่าน', '-ส้าน'],
		explanation: '',
		isLoanWord: false
	},
	{
		correct: 'ซาบซึ้ง',
		incorrect: ['ทราบซึ้ง'],
		explanation: '',
		isLoanWord: false
	},
	{
		correct: 'ซาลาเปา',
		incorrect: ['ซาละเปา', 'ซะละเปา'],
		explanation: '',
		isLoanWord: false
	},
	{
		correct: 'ซาวเสียง',
		incorrect: ['ซาวด์เสียง', 'ซาวน์เสียง', 'ซาวนด์เสียง'],
		explanation: 'หยั่งเสียงเพื่อฟังความคิดเห็น',
		isLoanWord: true
	},
	{
		correct: 'ซีเมนต์',
		incorrect: ['ซีเม็นต์', 'ซีเมนท์', 'ซีเม็นท์', 'ซีเม็น'],
		explanation: '',
		isLoanWord: true
	},
	{
		correct: 'ซุบหน่อไม้',
		incorrect: ['ซุปหน่อไม้'],
		explanation: 'อาหารอีสานมีลักษณะเป็นยำ, ซุป หมายถึงอาหารน้ำ',
		isLoanWord: false
	},
	{
		correct: 'ซุ่ม',
		incorrect: ['สุ่ม', 'สุ้ม'],
		explanation:
			'ซุ่ม = ซ่อน, แอบซ่อนคอยทีอยู่, สุ่ม = เครื่องมือจับปลา, เครื่องสานครอบขังไก่, ไม่เฉพาะเจาะจง',
		isLoanWord: false
	},
	{
		correct: 'ซุ้ม',
		incorrect: ['สุ้ม'],
		explanation: 'สิ่งที่เป็นพุ่มมีทางลอดได้, ส่วนบนของประตูหน้าต่าง',
		isLoanWord: false
	},
	{
		correct: 'เซ็น',
		incorrect: ['เซ็นต์'],
		explanation: 'จากคำอังกฤษ sign',
		isLoanWord: true
	},
	{
		correct: 'เซนติเมตร',
		incorrect: ['เซ็นติเมตร'],
		explanation: '',
		isLoanWord: true
	},
	{
		correct: 'แซ่บ',
		incorrect: ['แซบ'],
		explanation:
			'ตามพจนานุกรม ฉบับราชบัณฑิตยสถาน พ.ศ. 2554; ใส่รูปวรรณยุกต์เอกเพื่อบ่งว่าเป็นเสียงวรรณยุกต์โทและออกเสียงสั้น (อย่างคำว่า แน่บ)',
		isLoanWord: false
	},
	{
		correct: 'แซว',
		incorrect: ['แซ็ว'],
		explanation: 'ราชบัณฑิตฯ ออกมาแจงว่าพิมพ์พจนานุกรมผิด ให้ใช้ "แซว" ตามเดิม',
		isLoanWord: false
	},
	{
		correct: 'ไซ้',
		incorrect: ['ไซร้'],
		explanation: '',
		isLoanWord: false
	},
	{
		correct: 'โซม',
		incorrect: ['โทรม'],
		explanation:
			'โซม = เปียกทั่ว, เช่น เหงื่อโซมตัว, โทรม = เสื่อมสภาพ, ระดมฟันแทง, ร่วมกันข่มขืนกระทำชำเราหญิง ฯลฯ',
		isLoanWord: false
	},
	{
		correct: 'ฌาน',
		incorrect: ['ฌาณ'],
		explanation: '',
		isLoanWord: false
	},
	{
		correct: 'ฌาปนกิจ',
		incorrect: ['ฌาปณกิจ'],
		explanation: '',
		isLoanWord: false
	},
	{
		correct: 'เฌอ',
		incorrect: ['กะเฌอ', 'กระเฌอ'],
		explanation: 'ระวังสับสนกับ กระเชอ',
		isLoanWord: false
	},
	{
		correct: 'ญวน',
		incorrect: ['ญวณ'],
		explanation: '',
		isLoanWord: false
	},
	{
		correct: 'ญัตติ',
		incorrect: ['ญัติ'],
		explanation: '',
		isLoanWord: false
	},
	{
		correct: 'ญาณ',
		incorrect: ['ญาน'],
		explanation: '',
		isLoanWord: false
	},
	{
		correct: 'ญาติ',
		incorrect: ['ญาต'],
		explanation: '',
		isLoanWord: false
	},
	{
		correct: 'ฎีกา',
		incorrect: ['ฏีกา'],
		explanation: 'ใช้ ฎ ชฎา ตัวอักษรที่คล้ายกันทำให้เกิดความสับสน',
		isLoanWord: false
	},
	{
		correct: 'ฐาน',
		incorrect: ['ฐาณ'],
		explanation: '',
		isLoanWord: false
	},
	{
		correct: 'ดอกจัน *',
		incorrect: ['ดอกจันท์ *', 'ดอกจันทน์ *', 'ดอกจันทร์ *'],
		explanation: 'เครื่องหมาย *, ดอกของต้นจัน',
		isLoanWord: false
	},
	{
		correct: 'ดอกไม้จันทน์',
		incorrect: ['ดอกไม้จัน', 'ดอกไม้จันท์', 'ดอกไม้จันทร์'],
		explanation: 'ดอกไม้ประดิษฐ์สำหรับงานเผาศพ',
		isLoanWord: false
	},
	{
		correct: 'ดัตช์',
		incorrect: ['ดัชต์', 'ดัชท์', 'ดัทช์'],
		explanation: '',
		isLoanWord: true
	},
	{
		correct: 'ดาดตะกั่ว',
		incorrect: ['ดาษตะกั่ว'],
		explanation: '',
		isLoanWord: false
	},
	{
		correct: 'ดาดฟ้า',
		incorrect: ['ดาษฟ้า'],
		explanation: '',
		isLoanWord: false
	},
	{
		correct: 'ดาวน์',
		incorrect: ['ดาว์น', 'ดาว'],
		explanation: 'คำทับศัพท์ down ตัวสะกดหลักคือ ว',
		isLoanWord: true
	},
	{
		correct: 'ดาษดื่น',
		incorrect: ['ดาดดื่น'],
		explanation: '',
		isLoanWord: false
	},
	{
		correct: 'ดำรง',
		incorrect: ['ดำรงค์'],
		explanation: '',
		isLoanWord: false
	},
	{
		correct: 'ดำริ',
		incorrect: ['ดำหริ', 'ดำริห์'],
		explanation: 'อ่านว่า "ดำ-หริ", โบราณเขียน "ดำริห์"',
		isLoanWord: false
	},
	{
		correct: 'ดุล',
		incorrect: ['ดุลย์'],
		explanation:
			'ดุล เป็นคำนามแปลว่า ความเท่ากัน หรือความเสมอกัน, ส่วน ดุลย์ เป็นคำวิเศษณ์แปลว่า เท่ากัน หรือเสมอกัน (เลิกใช้แล้ว มีแต่เฉพาะที่ประกอบคำอื่น)',
		isLoanWord: false
	},
	{
		correct: 'โดยดุษณี',
		incorrect: ['โดยดุษฎี'],
		explanation:
			'ดุษณี หมายถึง นิ่ง, ดุษฎี หมายถึง ยินดี, มักใช้สลับกัน เช่น ในถ้อยคำว่า "ยอมรับโดยดุษณี"',
		isLoanWord: false
	},
	{
		correct: 'เดินเหิน',
		incorrect: ['เดินเหิร'],
		explanation: 'โบราณเขียน "เหิร"',
		isLoanWord: false
	},
	{
		correct: 'แดก',
		incorrect: ['แดรก', 'แด่ก', 'แดร่ก', 'แด๊ก'],
		explanation: '',
		isLoanWord: false
	},
	{
		correct: 'ไดรฟ์',
		incorrect: ['ไดร์ฟ'],
		explanation: 'คำทับศัพท์ drive ซึ่งมี ดร ควบกล้ำ',
		isLoanWord: true
	},
	{
		correct: 'ตรรกะ, ตรรก',
		incorrect: ['ตรรกกะ'],
		explanation: '',
		isLoanWord: false
	},
	{
		correct: 'ตราสัง',
		incorrect: ['ตราสังข์'],
		explanation: '',
		isLoanWord: false
	},
	{
		correct: 'ตรึงตรา',
		incorrect: ['ตรึงตา'],
		explanation: 'ติดแน่น',
		isLoanWord: false
	},
	{
		correct: 'ตะกร้า',
		incorrect: ['ตระกร้า'],
		explanation: '',
		isLoanWord: false
	},
	{
		correct: 'ตะราง',
		incorrect: ['ตาราง'],
		explanation: 'ที่คุมขัง',
		isLoanWord: false
	},
	{
		correct: 'ตานขโมย',
		incorrect: ['ตาลขโมย'],
		explanation: '',
		isLoanWord: false
	},
	{
		correct: 'ตาราง',
		incorrect: ['ตะราง'],
		explanation: 'ช่องสี่เหลี่ยม',
		isLoanWord: false
	},
	{
		correct: 'ตำรับ',
		incorrect: ['ตำหรับ'],
		explanation: '',
		isLoanWord: false
	},
	{
		correct: 'ใต้',
		incorrect: ['ไต้'],
		explanation: 'ใช้แสดงตำแหน่ง เช่น ใต้โต๊ะ ภาคใต้ แสงใต้ (ออโรรา)',
		isLoanWord: false
	},
	{
		correct: 'ใต้เท้า',
		incorrect: ['ไต้เท้า'],
		explanation: 'เปรียบเหมือนเราอยู่ข้างใต้ เท้าของผู้มีอำนาจบารมี ทำนองเดียวกับ ใต้ฝ่าพระบาท ฯลฯ',
		isLoanWord: false
	},
	{
		correct: 'ไต้',
		incorrect: ['ใต้'],
		explanation: 'คบเพลิง เช่น ขี้ไต้ จุดไต้ตำตอ น้ำตาแสงไต้',
		isLoanWord: false
	},
	{
		correct: 'ไต้ก๋ง',
		incorrect: ['ใต้ก๋ง'],
		explanation: 'นายท้ายเรือสำเภาหรือเรือประมง ทับศัพท์จากภาษาจีน',
		isLoanWord: false
	},
	{
		correct: 'ไต้ฝุ่น',
		incorrect: ['ใต้ฝุ่น'],
		explanation: 'ทับศัพท์มาจากภาษาจีน',
		isLoanWord: false
	},
	{
		correct: 'ไตรยางศ์',
		incorrect: ['ไตรยางค์'],
		explanation: '',
		isLoanWord: false
	},
	{
		correct: 'ไต้หวัน',
		incorrect: ['ใต้หวัน'],
		explanation: 'ทับศัพท์จากภาษาจีน',
		isLoanWord: false
	},
	{
		correct: 'ถนนลาดยาง',
		incorrect: ['ถนนราดยาง'],
		explanation: 'ลาด หมายถึง ปู',
		isLoanWord: false
	},
	{
		correct: 'ถ่วงดุล',
		incorrect: ['ถ่วงดุลย์'],
		explanation: '',
		isLoanWord: false
	},
	{
		correct: 'ถั่วพู',
		incorrect: ['ถั่วพลู'],
		explanation: 'ถั่วที่ด้านข้างมีรอยเป็นพู',
		isLoanWord: false
	},
	{
		correct: 'เถา',
		incorrect: ['เถาว์'],
		explanation: '',
		isLoanWord: false
	},
	{
		correct: 'ไถ่ตัว',
		incorrect: ['ถ่ายตัว'],
		explanation: 'เรียกค่าไถ่ ก็ใช้คำนี้',
		isLoanWord: false
	},
	{
		correct: 'ทโมน',
		incorrect: ['ทะโมน', 'โทมน'],
		explanation: '',
		isLoanWord: false
	},
	{
		correct: 'ทยอย',
		incorrect: ['ทะยอย'],
		explanation: '',
		isLoanWord: false
	},
	{
		correct: 'ทแยง',
		incorrect: ['ทะแยง', 'แทยง'],
		explanation: '',
		isLoanWord: false
	},
	{
		correct: 'ทรงกลด',
		incorrect: ['ทรงกรด'],
		explanation: '',
		isLoanWord: false
	},
	{
		correct: 'ทรมาทรกรรม',
		incorrect: ['ทรมานทรกรรม'],
		explanation: '',
		isLoanWord: false
	},
	{
		correct: 'ทรราช',
		incorrect: ['ทรราชย์'],
		explanation:
			'- ทรราช = ผู้ปกครองบ้านเมืองที่ใช้อำนาจสร้างความเดือดร้อน, ตามรากศัพท์หมายถึง ราชาชั่ว แต่สามารถใช้ได้กับทั้งที่เป็นราชาและไม่เป็นราชา- ทรราชย์ = รูปแบบ ระบบ หรือลัทธิการปกครองแบบทรราช',
		isLoanWord: false
	},
	{
		correct: 'ทระนง',
		incorrect: ['ทรนง'],
		explanation: '',
		isLoanWord: false
	},
	{
		correct: 'ทะนง',
		incorrect: ['ทนง'],
		explanation: '',
		isLoanWord: false
	},
	{
		correct: 'ทลาย',
		incorrect: ['ทะลาย'],
		explanation: 'พังทลาย',
		isLoanWord: false
	},
	{
		correct: 'ทศกัณฐ์',
		incorrect: ['ทศกัณฑ์'],
		explanation: 'กัณฑ์ แปลว่า คำเทศน์ตอนหนึ่ง; กัณฐ์ แปลว่า คอ',
		isLoanWord: false
	},
	{
		correct: 'ทอนซิล',
		incorrect: ['ทอมซิน'],
		explanation: '',
		isLoanWord: true
	},
	{
		correct: 'ทะนุถนอม',
		incorrect: ['ทนุถนอม'],
		explanation: '',
		isLoanWord: false
	},
	{
		correct: 'ทะนุบำรุง',
		incorrect: ['ทนุบำรุง'],
		explanation: 'สะกด "ทำนุบำรุง" ได้',
		isLoanWord: false
	},
	{
		correct: 'ทะลาย',
		incorrect: ['ทลาย'],
		explanation: 'ช่อผลของมะพร้าว',
		isLoanWord: false
	},
	{
		correct: 'ทะเลสาบ',
		incorrect: ['ทะเลสาป'],
		explanation: '',
		isLoanWord: false
	},
	{
		correct: 'ทัณฑ์',
		incorrect: ['ฑัณฑ์'],
		explanation: '',
		isLoanWord: false
	},
	{
		correct: 'ทารุณ',
		incorrect: ['ทารุน'],
		explanation: '',
		isLoanWord: false
	},
	{
		correct: 'ทีฆายุโก',
		incorrect: ['ฑีฆายุโก'],
		explanation: 'ทีฆายุ หมายถึง อายุยืนยาว',
		isLoanWord: false
	},
	{
		correct: 'ทุกรกิริยา',
		incorrect: ['ทุกขกิริยา', 'ทุกขรกิริยา'],
		explanation: 'หมายถึง กิจที่ทำได้ยาก',
		isLoanWord: false
	},
	{
		correct: 'ทุคติ',
		incorrect: ['ทุกข์คติ'],
		explanation: '',
		isLoanWord: false
	},
	{
		correct: 'ทุพพลภาพ',
		incorrect: ['ทุพลภาพ'],
		explanation: '',
		isLoanWord: false
	},
	{
		correct: 'ทุพภิกขภัย',
		incorrect: ['ทุภิกขภัย'],
		explanation: 'ทุส + ภิกขภัย, เปลี่ยน ส เป็น พ ตามหลักการสมาส',
		isLoanWord: false
	},
	{
		correct: 'ทุศีล',
		incorrect: ['ทุจศีล'],
		explanation: '',
		isLoanWord: false
	},
	{
		correct: 'ทูต',
		incorrect: ['ฑูต'],
		explanation: 'ทูตทุกอย่าง ใช้ ท ทหาร',
		isLoanWord: false
	},
	{
		correct: 'ทูนหัว',
		incorrect: ['ทูลหัว'],
		explanation: '',
		isLoanWord: false
	},
	{
		correct: 'ทูลกระหม่อม',
		incorrect: ['ทูนกระหม่อม'],
		explanation: '',
		isLoanWord: false
	},
	{
		correct: 'เท่',
		incorrect: ['เท่ห์'],
		explanation: '',
		isLoanWord: false
	},
	{
		correct: 'เทพนม',
		incorrect: ['เทพพนม'],
		explanation: 'เทวะ + นมะ ไม่ใช่ เทพ + พนม',
		isLoanWord: false
	},
	{
		correct: 'เทเวศร์',
		incorrect: ['เทเวศ', 'เทเวศน์'],
		explanation: 'เทว + อิศร์',
		isLoanWord: false
	},
	{
		correct: 'เทอญ',
		incorrect: ['เทิญ'],
		explanation: '',
		isLoanWord: false
	},
	{
		correct: 'เทอม',
		incorrect: ['เทิม', 'เทิร์ม'],
		explanation: '',
		isLoanWord: true
	},
	{
		correct: 'เท้าความ',
		incorrect: ['ท้าวความ'],
		explanation: 'เขียนเหมือน "เท้า"',
		isLoanWord: false
	},
	{
		correct: 'เทิด',
		incorrect: ['เทอด'],
		explanation: '',
		isLoanWord: false
	},
	{
		correct: 'เทิดทูน',
		incorrect: ['เทิดทูล'],
		explanation: '',
		isLoanWord: false
	},
	{
		correct: 'แท็กซี่',
		incorrect: ['แท๊กซี่'],
		explanation: '',
		isLoanWord: true
	},
	{
		correct: 'แทรกแซง',
		incorrect: ['แซกแซง'],
		explanation: '',
		isLoanWord: false
	},
	{
		correct: 'โทรทรรศน์',
		incorrect: ['โทรทัศน์'],
		explanation: 'กล้องส่องทางไกล',
		isLoanWord: false
	},
	{
		correct: 'โทรทัศน์',
		incorrect: ['โทรทรรศน์'],
		explanation: 'เครื่องใช้ไฟฟ้าชนิดหนึ่ง',
		isLoanWord: false
	},
	{
		correct: 'โทรศัพท์',
		incorrect: ['โทรศัพย์'],
		explanation: '',
		isLoanWord: false
	},
	{
		correct: 'ธนบัตร',
		incorrect: ['ธนาบัตร'],
		explanation: '',
		isLoanWord: false
	},
	{
		correct: 'ธนาณัติ',
		incorrect: ['ธนานัติ', 'ธนาณัต'],
		explanation: '',
		isLoanWord: false
	},
	{
		correct: 'ธรรมเนียม',
		incorrect: ['ทำเนียม'],
		explanation:
			'ในหนังสือเก่าๆ เขียน "ทำเนียม" ก็มี, แต่ปัจจุบัน ใช้ "ธรรมเนียม" (มาจาก ธรรม + นิยม)',
		isLoanWord: false
	},
	{
		correct: 'ธัญพืช',
		incorrect: ['ธัญญพืช'],
		explanation: '',
		isLoanWord: false
	},
	{
		correct: 'ธำมรงค์',
		incorrect: ['ธำมรง', 'ทำมะรงค์'],
		explanation: 'แปลว่า "แหวน"',
		isLoanWord: false
	},
	{
		correct: 'ธำรง',
		incorrect: ['ธำรงค์'],
		explanation: '',
		isLoanWord: false
	},
	{
		correct: 'ธุรกิจ',
		incorrect: ['ธุระกิจ'],
		explanation: 'สมาสแล้ว ลบวิสรรชนีย์',
		isLoanWord: false
	},
	{
		correct: 'นพปฎล',
		incorrect: ['นพปดล'],
		explanation: 'แปลว่า เก้าชั้น',
		isLoanWord: false
	},
	{
		correct: 'นภดล',
		incorrect: ['นพดล'],
		explanation: 'เว้นแต่ "นพดล" ที่เป็นชื่อเฉพาะ',
		isLoanWord: false
	},
	{
		correct: 'นวัตกรรม',
		incorrect: ['นวตกรรม'],
		explanation: '',
		isLoanWord: false
	},
	{
		correct: 'นอต',
		incorrect: ['น็อต', 'น๊อต'],
		explanation: 'ทับศัพท์จาก nut ในภาษาอังกฤษที่หมายถึงอุปกรณ์ช่าง',
		isLoanWord: true
	},
	{
		correct: 'นะ',
		incorrect: ['น๊ะ'],
		explanation: 'ออกเสียงวรรณยุกต์ตรี โดยไม่ปรากฏรูป',
		isLoanWord: false
	},
	{
		correct: 'นะคะ',
		incorrect: ['นะค่ะ', 'นะค๊ะ'],
		explanation: 'คะ เป็นเสียงตรี ไม่ต้องใช้ไม้ตรี ในขณะที่ ค่ะ เป็นเสียงโท',
		isLoanWord: false
	},
	{
		correct: 'นันทนาการ',
		incorrect: ['สันทนาการ'],
		explanation: '',
		isLoanWord: false
	},
	{
		correct: 'นัย',
		incorrect: ['นัยยะ'],
		explanation: 'อ่านได้ทั้ง ไน และ ไน-ยะ',
		isLoanWord: false
	},
	{
		correct: 'นัยน์ตา',
		incorrect: ['นัยตา'],
		explanation: '',
		isLoanWord: false
	},
	{
		correct: 'น่า',
		incorrect: ['หน้า'],
		explanation:
			'คำประกอบหน้ากริยา หมายความว่า ควร เช่น น่าจะทำอย่างนั้น น่าจะเป็นอย่างนี้; ชวนให้, ทำให้อยากจะ, เช่น น่ากิน น่ารัก',
		isLoanWord: false
	},
	{
		correct: 'นาที',
		incorrect: ['นาฑี'],
		explanation:
			'นาฑี เป็นภาษาสันสกฤต พบบ้างในหนังสือเก่า ปัจจุบันพจนานุกรมให้สะกดแบบเดียวเท่านั้น',
		isLoanWord: false
	},
	{
		correct: 'นานัปการ',
		incorrect: ['นานับประการ'],
		explanation: '',
		isLoanWord: false
	},
	{
		correct: 'นานา',
		incorrect: ['นาๆ'],
		explanation: 'คำมูลสองพยางค์',
		isLoanWord: false
	},
	{
		correct: 'น้ำจัณฑ์',
		incorrect: ['น้ำจัน'],
		explanation: '',
		isLoanWord: false
	},
	{
		correct: 'น้ำมันก๊าด',
		incorrect: ['น้ำมันก๊าซ', '-ก๊าส'],
		explanation: '',
		isLoanWord: false
	},
	{
		correct: 'น้ำแข็งไส',
		incorrect: ['น้ำแข็งใส'],
		explanation: 'หมายถึงการนำน้ำแข็งไปไสบนกบ จนได้เกล็ดน้ำแข็ง เป็นวิธีทำแบบดั้งเดิม',
		isLoanWord: false
	},
	{
		correct: 'นิเทศ',
		incorrect: ['นิเทศน์', 'นิเทส'],
		explanation: '',
		isLoanWord: false
	},
	{
		correct: 'นิมิต',
		incorrect: ['นิมิตร', 'นิรมิตร'],
		explanation: '',
		isLoanWord: false
	},
	{
		correct: 'นิเวศวิทยา',
		incorrect: ['นิเวศน์วิทยา'],
		explanation: '',
		isLoanWord: false
	},
	{
		correct: 'เนรมิต',
		incorrect: ['เนรมิตร'],
		explanation: '',
		isLoanWord: false
	},
	{
		correct: 'เนืองนิตย์',
		incorrect: ['เนืองนิจ'],
		explanation: '',
		isLoanWord: false
	},
	{
		correct: 'แน่นหนา',
		incorrect: ['หนาแน่น'],
		explanation:
			'- "แน่นหนา" ว่า มั่นคง เช่น ใส่กุญแจแน่นหนา มีหลักฐานมัดตัวแน่นหนา, แข็งแรง เช่น ประตูหน้าต่างแน่นหนา, บางทีก็ใช้เข้าคู่กับ ปึกแผ่น เป็น เป็นปึกแผ่นแน่นหนา.- "หนาแน่น" ว่า คับคั่ง, แออัด, เช่น กรุงเทพฯ มีประชากรหนาแน่นมาก.',
		isLoanWord: false
	},
	{
		correct: 'โน้ต',
		incorrect: ['โน๊ต', 'โน้ท', 'โน๊ท'],
		explanation: 'อักษรต่ำ ไม่ใส่ไม้ตรี',
		isLoanWord: true
	},
	{
		correct: 'บรรทัด',
		incorrect: ['บันทัด'],
		explanation: '',
		isLoanWord: false
	},
	{
		correct: 'บรรทุก',
		incorrect: ['บันทุก'],
		explanation: '',
		isLoanWord: false
	},
	{
		correct: 'บรรลุ',
		incorrect: ['บันลุ'],
		explanation: '',
		isLoanWord: false
	},
	{
		correct: 'บรรเลง',
		incorrect: ['บันเลง'],
		explanation: '',
		isLoanWord: false
	},
	{
		correct: 'บรั่นดี',
		incorrect: ['บะหรั่นดี'],
		explanation: '',
		isLoanWord: true
	},
	{
		correct: 'บริสุทธิ์',
		incorrect: ['บริสุทธ', 'บริสุทธิ'],
		explanation: '',
		isLoanWord: false
	},
	{
		correct: 'บล็อก',
		incorrect: ['บล็อค', 'บล๊อก'],
		explanation: 'ตามหลักการทับศัพท์',
		isLoanWord: true
	},
	{
		correct: 'บ่วงบาศ',
		incorrect: ['บ่วงบาศก์', 'บ่วงบาต', 'บ่วงบาท'],
		explanation: '',
		isLoanWord: false
	},
	{
		correct: 'บอระเพ็ด',
		incorrect: ['บรเพ็ด', 'บอระเพชร'],
		explanation: '',
		isLoanWord: false
	},
	{
		correct: 'บังสุกุล',
		incorrect: ['บังสกุล'],
		explanation: '',
		isLoanWord: false
	},
	{
		correct: 'บังเอิญ',
		incorrect: ['บังเอิน'],
		explanation: '',
		isLoanWord: false
	},
	{
		correct: 'บัญญัติไตรยางศ์',
		incorrect: ['บัญญัติไตรยางค์'],
		explanation: 'เหมือน ไตรยางศ์',
		isLoanWord: false
	},
	{
		correct: 'บัตรสนเท่ห์',
		incorrect: ['บัตรสนเท่'],
		explanation: '',
		isLoanWord: false
	},
	{
		correct: 'บันดาล',
		incorrect: ['บรรดาล'],
		explanation: '',
		isLoanWord: false
	},
	{
		correct: 'บันได',
		incorrect: ['บรรได'],
		explanation: '',
		isLoanWord: false
	},
	{
		correct: 'บันเทิง',
		incorrect: ['บรรเทิง'],
		explanation: '',
		isLoanWord: false
	},
	{
		correct: 'บันลือ',
		incorrect: ['บรรลือ'],
		explanation: '',
		isLoanWord: false
	},
	{
		correct: 'บางลำพู',
		incorrect: ['บางลำภู'],
		explanation: '',
		isLoanWord: false
	},
	{
		correct: 'บาดทะยัก',
		incorrect: ['บาททะยัก', 'บาดทยัก'],
		explanation: '',
		isLoanWord: false
	},
	{
		correct: 'บาตร',
		incorrect: ['บาต'],
		explanation: 'เครื่องใช้อย่างหนึ่งของพระสงฆ์',
		isLoanWord: false
	},
	{
		correct: 'บาทบงสุ์',
		incorrect: ['บาทบงส์'],
		explanation: 'อ่านว่า บาด-ทะ-บง',
		isLoanWord: false
	},
	{
		correct: 'บาทหลวง',
		incorrect: ['บาดหลวง'],
		explanation: '',
		isLoanWord: false
	},
	{
		correct: 'บำเหน็จ',
		incorrect: ['บำเน็จ'],
		explanation: '',
		isLoanWord: false
	},
	{
		correct: 'บิณฑบาต',
		incorrect: ['บิณฑบาตร', 'บิณฑบาท'],
		explanation: '',
		isLoanWord: false
	},
	{
		correct: 'บิดพลิ้ว',
		incorrect: ['บิดพริ้ว'],
		explanation: '',
		isLoanWord: false
	},
	{
		correct: 'บุคคล',
		incorrect: ['บุคล'],
		explanation: '',
		isLoanWord: false
	},
	{
		correct: 'บุคลากร',
		incorrect: ['บุคคลากร'],
		explanation: '',
		isLoanWord: false
	},
	{
		correct: 'บุคลิกภาพ',
		incorrect: ['บุคคลิกภาพ'],
		explanation: '',
		isLoanWord: false
	},
	{
		correct: 'บุปผชาติ',
		incorrect: ['บุปผาชาติ'],
		explanation: '',
		isLoanWord: false
	},
	{
		correct: 'บุษราคัม',
		incorrect: ['บุษราคำ'],
		explanation: '',
		isLoanWord: false
	},
	{
		correct: 'บูชายัญ',
		incorrect: ['บูชายันต์'],
		explanation: '',
		isLoanWord: false
	},
	{
		correct: 'บูรณปฏิสังขรณ์',
		incorrect: ['บูรณะปฏิสังขรณ์'],
		explanation: 'คำสมาส',
		isLoanWord: false
	},
	{
		correct: 'เบญจเพส',
		incorrect: ['เบญจเพศ'],
		explanation: 'เพส มาจากคำว่า วีสะ=20 เบญจ =5, เบญจเพส = 25',
		isLoanWord: false
	},
	{
		correct: 'เบนซิน',
		incorrect: ['เบ็นซิน', 'เบนซิล'],
		explanation: '',
		isLoanWord: true
	},
	{
		correct: 'เบรก',
		incorrect: ['เบรค'],
		explanation: 'ศัพท์บัญญัติ หรือใช้คำว่า ห้ามล้อ',
		isLoanWord: true
	},
	{
		correct: 'ปฏิกิริยา',
		incorrect: ['ปฏิกริยา'],
		explanation: '',
		isLoanWord: false
	},
	{
		correct: 'ปฏิสันถาร',
		incorrect: ['ปฏิสัณฐาน', 'ปฏิสันถาน'],
		explanation: '',
		isLoanWord: false
	},
	{
		correct: 'ปฏิทิน',
		incorrect: ['ปติทิน'],
		explanation: '',
		isLoanWord: false
	},
	{
		correct: 'ปฏิพัทธ์',
		incorrect: ['ประติพัทธ์'],
		explanation: '',
		isLoanWord: false
	},
	{
		correct: 'ปฏิสังขรณ์',
		incorrect: ['ปฏิสังขร'],
		explanation: '',
		isLoanWord: false
	},
	{
		correct: 'ปฐมนิเทศ',
		incorrect: ['ปฐมนิเทศก์', 'ปฐมนิเทศน์'],
		explanation: '',
		isLoanWord: false
	},
	{
		correct: 'ปณิธาน',
		incorrect: ['ปนิธาน'],
		explanation: 'ตั้งใจไว้',
		isLoanWord: false
	},
	{
		correct: 'ประณิธาน',
		incorrect: ['ประนิธาน'],
		explanation: 'ตั้งใจไว้',
		isLoanWord: false
	},
	{
		correct: 'ปรนนิบัติ',
		incorrect: ['ปรณนิบัติ'],
		explanation: '',
		isLoanWord: false
	},
	{
		correct: 'ปรมาณู',
		incorrect: ['ปรมณู'],
		explanation: 'ปรม + อณู',
		isLoanWord: false
	},
	{
		correct: 'ปรองดอง',
		incorrect: ['ปองดอง'],
		explanation: '',
		isLoanWord: false
	},
	{
		correct: 'ประกายพรึก',
		incorrect: ['ประกายพฤกษ์'],
		explanation: '',
		isLoanWord: false
	},
	{
		correct: 'ประกาศนียบัตร',
		incorrect: ['ประกาศณียบัตร'],
		explanation: '',
		isLoanWord: false
	},
	{
		correct: 'ประกาศิต',
		incorrect: ['ประกาษิต'],
		explanation: '',
		isLoanWord: false
	},
	{
		correct: 'ประจัญบาน',
		incorrect: ['ประจันบาน', 'ประจันบาล', 'ประจัญบาล'],
		explanation: '',
		isLoanWord: false
	},
	{
		correct: 'ประจันหน้า',
		incorrect: ['ประจัญหน้า'],
		explanation: '',
		isLoanWord: false
	},
	{
		correct: 'ประจันห้อง',
		incorrect: ['ประจัญห้อง'],
		explanation: '',
		isLoanWord: false
	},
	{
		correct: 'ประจำการ',
		incorrect: ['ประจำการณ์'],
		explanation: '',
		isLoanWord: false
	},
	{
		correct: 'ประณต',
		incorrect: ['ประนต'],
		explanation: '(กริยา) น้อมไหว้',
		isLoanWord: false
	},
	{
		correct: 'ประณม',
		incorrect: ['ประนม'],
		explanation: '(อาการนาม) การน้อมไหว้',
		isLoanWord: false
	},
	{
		correct: 'ประณาม',
		incorrect: ['ประนาม'],
		explanation: '',
		isLoanWord: false
	},
	{
		correct: 'ประณีต',
		incorrect: ['ปราณีต', 'ประนีต'],
		explanation: '',
		isLoanWord: false
	},
	{
		correct: 'ประดิดประดอย',
		incorrect: ['ประดิษฐ์ประดอย'],
		explanation: '',
		isLoanWord: false
	},
	{
		correct: 'ประนีประนอม',
		incorrect: ['ประณีประณอม'],
		explanation: '',
		isLoanWord: false
	},
	{
		correct: 'ประเมิน',
		incorrect: ['ประเมิณ'],
		explanation: 'มักสับสนกับ "ประมาณ"',
		isLoanWord: false
	},
	{
		correct: 'ประสบการณ์',
		incorrect: ['ประสพการณ์'],
		explanation: '',
		isLoanWord: false
	},
	{
		correct: 'ประสบความสำเร็จ',
		incorrect: ['ประสพความสำเร็จ'],
		explanation:
			'"ประสบ" เป็นคำกริยาแปลว่าพบหรือพบปะ  ส่วน "ประสพ" เป็นคำนามมีความหมายว่าการเกิดผล  ในภาษาไทยจึงใช้ "ประสบ" เพียงรูปเดียว เช่น ประสบความสำเร็จ ประสบการณ์ ประสบอุทกภัย ประสบโชค',
		isLoanWord: false
	},
	{
		correct: 'ประสูติ',
		incorrect: ['ประสูต', 'ประสูตร'],
		explanation: '',
		isLoanWord: false
	},
	{
		correct: 'ประสูติการ',
		incorrect: ['ประสูติกาล'],
		explanation: 'การคลอด',
		isLoanWord: false
	},
	{
		correct: 'ประสูติกาล',
		incorrect: ['ประสูติการ'],
		explanation: 'เวลาที่คลอด',
		isLoanWord: false
	},
	{
		correct: 'ประหลาด',
		incorrect: ['ปะหลาด', 'ปลาด'],
		explanation: '',
		isLoanWord: false
	},
	{
		correct: 'ประหัตประหาร',
		incorrect: ['ประหัดประหาร', 'ประหัตถ์ประหาร'],
		explanation: '',
		isLoanWord: false
	},
	{
		correct: 'ประหาณ',
		incorrect: ['ประหาร'],
		explanation:
			'ประหาณ หรือ ปหาน หมายถึง ละทิ้ง เช่น สมุจเฉทประหาณ (การตัดขาดและการละทิ้ง), ปหานกิเลส (ละทิ้งกิเลส)',
		isLoanWord: false
	},
	{
		correct: 'ประหารชีวิต',
		incorrect: ['ประหาณชีวิต', 'ประหานชีวติ'],
		explanation: 'ประหาร หมายถึง ตี ฟัน ทำลาย หรือ ฆ่า เช่น ประหารชีวิต',
		isLoanWord: false
	},
	{
		correct: 'ปรัมปรา',
		incorrect: ['ปรำปรา', 'ปะรำปะรา'],
		explanation: 'อ่านว่า ปะ-รำ-ปะ-รา',
		isLoanWord: false
	},
	{
		correct: 'ปรัศนี',
		incorrect: ['ปรัศนีย์'],
		explanation: '',
		isLoanWord: false
	},
	{
		correct: 'ปรากฏ',
		incorrect: ['ปรากฎ'],
		explanation: 'ใช้ ฏ ปฏัก',
		isLoanWord: false
	},
	{
		correct: 'เมตตาปรานี',
		incorrect: ['เมตตาปราณี'],
		explanation: 'ปราณี = สิ่งมีชีวิต ผู้มีชีวิต คือ ผู้มีลมหายใจ ได้แก่ สัตว์ คน เป็นต้น',
		isLoanWord: false
	},
	{
		correct: 'ปรานีปราศรัย',
		incorrect: ['ปราณีปราศัย'],
		explanation: '',
		isLoanWord: false
	},
	{
		correct: 'ปรารถนา',
		incorrect: ['ปราถนา'],
		explanation: 'อ่านว่า "ปราด-ถะ-หนา"',
		isLoanWord: false
	},
	{
		correct: 'ปราศจาก',
		incorrect: ['ปราศจาค'],
		explanation: '',
		isLoanWord: false
	},
	{
		correct: 'ปล้นสะดม',
		incorrect: ['ปล้นสดมภ์'],
		explanation: 'สดมภ์ แปลว่า เสาหรือช่องตามแนวตั้ง',
		isLoanWord: false
	},
	{
		correct: 'ปวารณา',
		incorrect: ['ปวารนา'],
		explanation: '',
		isLoanWord: false
	},
	{
		correct: 'ปะทะ',
		incorrect: ['ประทะ'],
		explanation: '',
		isLoanWord: false
	},
	{
		correct: 'ปะแล่ม',
		incorrect: ['ปแล่ม', 'แปล่ม'],
		explanation: '',
		isLoanWord: false
	},
	{
		correct: 'ปักษิน',
		incorrect: ['ปักษิณ'],
		explanation: '',
		isLoanWord: false
	},
	{
		correct: 'ปาฏิหาริย์',
		incorrect: ['ปาฏิหาร', 'ปาฏิหารย์'],
		explanation: '',
		isLoanWord: false
	},
	{
		correct: 'ปาติโมกข์',
		incorrect: ['ปาฏิโมกข์'],
		explanation: '',
		isLoanWord: false
	},
	{
		correct: 'ปาริชาต',
		incorrect: ['ปาริชาติ'],
		explanation: '',
		isLoanWord: false
	},
	{
		correct: 'ปิกนิก',
		incorrect: ['ปิคนิค'],
		explanation: 'คำทับศัพท์',
		isLoanWord: true
	},
	{
		correct: 'ปุโรหิต',
		incorrect: ['ปุโลหิต'],
		explanation: '',
		isLoanWord: false
	},
	{
		correct: 'เปอร์เซ็นต์',
		incorrect: ['เปอร์เซนต์'],
		explanation: 'คำทับศัพท์',
		isLoanWord: true
	},
	{
		correct: 'เป๋อเหลอ',
		incorrect: ['เป๋อเล๋อ'],
		explanation: 'อักษรต่ำ ไม่ใช้วรรณยุกต์จัตวา',
		isLoanWord: false
	},
	{
		correct: 'ผดุง',
		incorrect: ['ผะดุง'],
		explanation: '',
		isLoanWord: false
	},
	{
		correct: 'ผรุสวาท',
		incorrect: ['ผรุสวาส'],
		explanation: '',
		isLoanWord: false
	},
	{
		correct: 'ผลลัพธ์',
		incorrect: ['ผลลัพท์'],
		explanation: '',
		isLoanWord: false
	},
	{
		correct: 'ผล็อย',
		incorrect: ['ผลอย'],
		explanation: '',
		isLoanWord: false
	},
	{
		correct: 'ผลัดเปลี่ยน',
		incorrect: ['ผัดเปลี่ยน'],
		explanation: '',
		isLoanWord: false
	},
	{
		correct: 'ผลัดผ้า',
		incorrect: ['ผัดผ้า'],
		explanation: '',
		isLoanWord: false
	},
	{
		correct: 'ผลัดเวร',
		incorrect: ['ผัดเวร'],
		explanation: '',
		isLoanWord: false
	},
	{
		correct: 'ผลานิสงส์',
		incorrect: ['ผลานิสงฆ์'],
		explanation: '',
		isLoanWord: false
	},
	{
		correct: 'ผอบ',
		incorrect: ['ผะอบ'],
		explanation: '',
		isLoanWord: false
	},
	{
		correct: 'ผัดผ่อน',
		incorrect: ['ผลัดผ่อน'],
		explanation: '',
		isLoanWord: false
	},
	{
		correct: 'ผัดวันประกันพรุ่ง',
		incorrect: ['ผลัดวันประกันพรุ่ง'],
		explanation: '',
		isLoanWord: false
	},
	{
		correct: 'ผัดหนี้',
		incorrect: ['ผลัดหนี้'],
		explanation: '',
		isLoanWord: false
	},
	{
		correct: 'ผาสุก',
		incorrect: ['ผาสุข'],
		explanation: '',
		isLoanWord: false
	},
	{
		correct: 'ผีซ้ำด้ำพลอย',
		incorrect: ['ผีซ้ำด้ามพลอย'],
		explanation: 'ด้ำ เป็นภาษาเหนือ แปลว่า ผีเรือน',
		isLoanWord: false
	},
	{
		correct: 'ผุดลุกผุดนั่ง',
		incorrect: ['ผลุดลุกผลุดนั่ง'],
		explanation: '',
		isLoanWord: false
	},
	{
		correct: 'ผูกพัน',
		incorrect: ['ผูกพันธ์'],
		explanation: '',
		isLoanWord: false
	},
	{
		correct: 'ผู้เยาว์',
		incorrect: ['ผู้เยา'],
		explanation: '',
		isLoanWord: false
	},
	{
		correct: 'เผลอไผล',
		incorrect: ['เผอไผ'],
		explanation: '',
		isLoanWord: false
	},
	{
		correct: 'เผอเรอ',
		incorrect: ['เผลอเรอ'],
		explanation: '',
		isLoanWord: false
	},
	{
		correct: 'เผอิญ',
		incorrect: ['ผเอิญ', 'ผะเอิญ'],
		explanation: '',
		isLoanWord: false
	},
	{
		correct: 'เผ่าพันธุ์',
		incorrect: ['เผ่าพัน'],
		explanation: '',
		isLoanWord: false
	},
	{
		correct: 'แผ่ซ่าน',
		incorrect: ['แผ่ส้าน', 'แผ่ซ้าน'],
		explanation: '',
		isLoanWord: false
	},
	{
		correct: 'แผนการ',
		incorrect: ['แผนการณ์'],
		explanation: '',
		isLoanWord: false
	},
	{
		correct: 'แผลงฤทธิ์',
		incorrect: ['แผงฤทธิ์'],
		explanation: '',
		isLoanWord: false
	},
	{
		correct: 'ไผท',
		incorrect: ['ผไท', 'ผะไท'],
		explanation: '',
		isLoanWord: false
	},
	{
		correct: 'ผัดไทย',
		incorrect: ['ผัดไท'],
		explanation: '',
		isLoanWord: false
	},
	{
		correct: 'ฝรั่งเศส',
		incorrect: ['ฝรั่งเศษ'],
		explanation: '',
		isLoanWord: false
	},
	{
		correct: 'ฝักฝ่าย',
		incorrect: ['ฝักใฝ่', 'ฝักไฝ่'],
		explanation: 'พวก, ข้าง',
		isLoanWord: false
	},
	{
		correct: 'ฝักใฝ่',
		incorrect: ['ฝักฝ่าย', 'ฝักไฝ่'],
		explanation: 'เอาใจใส่, ผูกพัน',
		isLoanWord: false
	},
	{
		correct: 'ฝากครรภ์',
		incorrect: ['ฝากครร'],
		explanation: '',
		isLoanWord: false
	},
	{
		correct: 'ฝีดาษ',
		incorrect: ['ฝีดาด'],
		explanation: 'ไข้ทรพิษ',
		isLoanWord: false
	},
	{
		correct: 'ฝึกปรือ',
		incorrect: ['ฝึกปือ', 'ฝึกปลือ'],
		explanation: '',
		isLoanWord: false
	},
	{
		correct: 'ไฝ',
		incorrect: ['ใฝ'],
		explanation: 'คำนอกกฎการใช้ไม้ม้วน',
		isLoanWord: false
	},
	{
		correct: 'พงศ์พันธุ์',
		incorrect: ['พงพันธุ์', 'พงษ์พันธุ์'],
		explanation: '',
		isLoanWord: false
	},
	{
		correct: 'พจนานุกรม',
		incorrect: ['พจณานุกรม'],
		explanation: 'พจน + อนุกรม',
		isLoanWord: false
	},
	{
		correct: 'ฯพณฯ',
		incorrect: ['พณฯ', 'ฯพณ', 'พณ'],
		explanation: 'อ่านว่า "พะ-นะ-ท่าน"',
		isLoanWord: false
	},
	{
		correct: 'พยัก',
		incorrect: ['พะยัก'],
		explanation: '',
		isLoanWord: false
	},
	{
		correct: 'พยักพเยิด',
		incorrect: ['พะยักพะเยิด', 'พยักเพยิด'],
		explanation: '',
		isLoanWord: false
	},
	{
		correct: 'พยัคฆ์',
		incorrect: ['พยัค', 'พยัฆ'],
		explanation: 'เสือ',
		isLoanWord: false
	},
	{
		correct: 'พยาน',
		incorrect: ['พะยาน'],
		explanation: '',
		isLoanWord: false
	},
	{
		correct: 'พยาบาท',
		incorrect: ['พญาบาท', 'พยาบาตร'],
		explanation: '',
		isLoanWord: false
	},
	{
		correct: 'พยุง',
		incorrect: ['พะยุง'],
		explanation: '',
		isLoanWord: false
	},
	{
		correct: 'พเยีย',
		incorrect: ['พะเยีย', 'เพยีย'],
		explanation: 'พวงดอกไม้',
		isLoanWord: false
	},
	{
		correct: 'พรรณนา',
		incorrect: ['พรรณา'],
		explanation: 'อ่านว่า พัน-นะ-นา',
		isLoanWord: false
	},
	{
		correct: 'พรหมจรรย์',
		incorrect: ['พรมจรรย์'],
		explanation: '',
		isLoanWord: false
	},
	{
		correct: 'พราหมณ์',
		incorrect: ['พราห์มณ์', 'พรามณ์'],
		explanation: 'อ่านว่า พฺราม',
		isLoanWord: false
	},
	{
		correct: 'พร่ำพลอด',
		incorrect: ['พร่ำพรอด'],
		explanation: '',
		isLoanWord: false
	},
	{
		correct: 'พฤศจิกายน',
		incorrect: ['พฤษจิกายน'],
		explanation: '',
		isLoanWord: false
	},
	{
		correct: 'พฤษภาคม',
		incorrect: ['พฤศภาคม'],
		explanation: '',
		isLoanWord: false
	},
	{
		correct: 'พลศึกษา',
		incorrect: ['พละศึกษา'],
		explanation: 'คำสมาส',
		isLoanWord: false
	},
	{
		correct: 'พละกำลัง',
		incorrect: ['พลกำลัง'],
		explanation: '',
		isLoanWord: false
	},
	{
		correct: 'พลาสติก',
		incorrect: ['พลาสติค'],
		explanation: '',
		isLoanWord: true
	},
	{
		correct: 'พหูสูต',
		incorrect: ['พหูสูตร'],
		explanation: '',
		isLoanWord: false
	},
	{
		correct: 'พะแนง',
		incorrect: ['พแนง', 'แพนง'],
		explanation: '',
		isLoanWord: false
	},
	{
		correct: 'พะยอม',
		incorrect: ['พยอม'],
		explanation: 'ชื่อต้นไม้ มีดอกสีขาว',
		isLoanWord: false
	},
	{
		correct: 'พะวักพะวน',
		incorrect: ['พวักพวน'],
		explanation: '',
		isLoanWord: false
	},
	{
		correct: 'พังทลาย',
		incorrect: ['พังทะลาย'],
		explanation: '',
		isLoanWord: false
	},
	{
		correct: 'พันทาง',
		incorrect: ['พันธุ์ทาง'],
		explanation: 'ลูกผสมต่างสายพันธุ์',
		isLoanWord: false
	},
	{
		correct: 'พัศดี',
		incorrect: ['พัสดี'],
		explanation: '',
		isLoanWord: false
	},
	{
		correct: 'พัสดุ',
		incorrect: ['พัศดุ'],
		explanation: '',
		isLoanWord: false
	},
	{
		correct: 'พากย์',
		incorrect: ['พากษ์'],
		explanation: 'พากย์หนัง',
		isLoanWord: false
	},
	{
		correct: 'พาณิชย์',
		incorrect: ['พานิชย์', 'พานิชย', 'พนิชย์', 'พานิช', 'พนิช'],
		explanation:
			'ใช้ ณ เสมอ รวมถึงรูปศัพท์เดิมก่อนแผลง ว เป็น พ เช่น วาณิชย์ วาณิชกะ วณิชย์ วณิชยา วาณิช วณิชพาณิชย์ พาณิชย หรือ พณิชย์ แปลว่าการค้า พาณิชหรือพณิชหมายถึงพ่อค้ายกเว้นวิสามานยนามบางคำ เช่น ไทยวัฒนาพานิช, กรุงไทยพานิชประกันภัย,  ศุภชัย พานิชภักดิ์, วิจารณ์ พานิช และ ชิน โสภณพนิช',
		isLoanWord: false
	},
	{
		correct: 'พานจะเป็นลม',
		incorrect: ['พาลจะเป็นลม'],
		explanation: '',
		isLoanWord: false
	},
	{
		correct: 'พาหุรัด',
		incorrect: ['พาหุรัต', 'พาหุรัตน์'],
		explanation: '',
		isLoanWord: false
	},
	{
		correct: 'พิณพาทย์',
		incorrect: ['พิณภาทย์'],
		explanation: '',
		isLoanWord: false
	},
	{
		correct: 'พิธีรีตอง',
		incorrect: ['พิธีรีตรอง'],
		explanation: '',
		isLoanWord: false
	},
	{
		correct: 'พิบูล',
		incorrect: ['พิบูลย์'],
		explanation: '',
		isLoanWord: false
	},
	{
		correct: 'พิพิธภัณฑ์',
		incorrect: ['พิพิทธภัณฑ์'],
		explanation: '',
		isLoanWord: false
	},
	{
		correct: 'พิราบ',
		incorrect: ['พิราป'],
		explanation: 'นกชนิดหนึ่ง',
		isLoanWord: false
	},
	{
		correct: 'พิลาป',
		incorrect: ['พิราป'],
		explanation: 'คร่ำครวญ, ร้องไห้ เช่น รำพันพิลาป',
		isLoanWord: false
	},
	{
		correct: 'พิศวง',
		incorrect: ['พิสวง'],
		explanation: '',
		isLoanWord: false
	},
	{
		correct: 'พิศวาส',
		incorrect: ['พิสวาส'],
		explanation: '',
		isLoanWord: false
	},
	{
		correct: 'พิสดาร',
		incorrect: ['พิศดาร'],
		explanation: '',
		isLoanWord: false
	},
	{
		correct: 'พิสมัย',
		incorrect: ['พิศมัย'],
		explanation: '',
		isLoanWord: false
	},
	{
		correct: 'พึมพำ',
		incorrect: ['พึมพัม'],
		explanation: '',
		isLoanWord: false
	},
	{
		correct: 'พุดตาน',
		incorrect: ['พุดตาล'],
		explanation: 'ดอกไม้ชนิดหนึ่ง',
		isLoanWord: false
	},
	{
		correct: 'พุทธชาด',
		incorrect: ['พุทธชาติ'],
		explanation: 'ดอกไม้ชนิดหนึ่ง',
		isLoanWord: false
	},
	{
		correct: 'พู่กัน',
		incorrect: ['ภู่กัน'],
		explanation: '',
		isLoanWord: false
	},
	{
		correct: 'พู่ระหง',
		incorrect: ['ภู่ระหง'],
		explanation: '',
		isLoanWord: false
	},
	{
		correct: 'เพชฌฆาต',
		incorrect: ['เพชรฆาต', 'เพ็ชรฆาต'],
		explanation: '',
		isLoanWord: false
	},
	{
		correct: 'เพชร',
		incorrect: ['เพ็ชร'],
		explanation: '',
		isLoanWord: false
	},
	{
		correct: 'เพศสัมพันธ์',
		incorrect: ['เพศสัมพันธุ์'],
		explanation: '',
		isLoanWord: false
	},
	{
		correct: 'เพนียด',
		incorrect: ['พเนียด', 'พะเนียด'],
		explanation: '',
		isLoanWord: false
	},
	{
		correct: 'เพริศพริ้ง',
		incorrect: ['เพริดพริ้ง'],
		explanation: '',
		isLoanWord: false
	},
	{
		correct: 'เพิ่มพูน',
		incorrect: ['เพิ่มพูล'],
		explanation: '',
		isLoanWord: false
	},
	{
		correct: 'เพียบพร้อม',
		incorrect: ['เพรียบพร้อม'],
		explanation: '',
		isLoanWord: false
	},
	{
		correct: 'แพทยศาสตร์',
		incorrect: ['แพทย์ศาสตร์'],
		explanation: '',
		isLoanWord: false
	},
	{
		correct: 'โพชฌงค์',
		incorrect: ['โพชงค์'],
		explanation: '',
		isLoanWord: false
	},
	{
		correct: 'โพดำ',
		incorrect: ['โพธิ์ดำ'],
		explanation: '',
		isLoanWord: false
	},
	{
		correct: 'โพแดง',
		incorrect: ['โพธิ์แดง'],
		explanation: '',
		isLoanWord: false
	},
	{
		correct: 'โพทะเล',
		incorrect: ['โพธิ์ทะเล'],
		explanation: '',
		isLoanWord: false
	},
	{
		correct: 'โพนทะนา',
		incorrect: ['โพนทนา'],
		explanation: '',
		isLoanWord: false
	},
	{
		correct: 'โพระดก',
		incorrect: ['โพรดก'],
		explanation: '',
		isLoanWord: false
	},
	{
		correct: 'โพสพ',
		incorrect: ['โพศพ'],
		explanation: '',
		isLoanWord: false
	},
	{
		correct: 'ไพฑูรย์',
		incorrect: ['ไพทูรย์'],
		explanation: '',
		isLoanWord: false
	},
	{
		correct: 'ฟังก์ชัน',
		incorrect: ['ฟังก์ชั่น'],
		explanation: 'ไม่มีไม้เอก',
		isLoanWord: false
	},
	{
		correct: 'ฟั่น',
		incorrect: ['ฝั้น'],
		explanation: 'เช่น ฟั่นเชือก ฟั่นเทียน',
		isLoanWord: false
	},
	{
		correct: 'ฟันคุด',
		incorrect: ['ฟันครุฑ', 'ฟันครุท'],
		explanation: 'คุด หมายถึง งอกงออยู่ภายในไม่โผล่ออกมาตามปรกติ ระวังสับสนกับ เล็บครุฑ ชื่อต้นไม้',
		isLoanWord: false
	},
	{
		correct: 'ฟาทอม',
		incorrect: ['ฟาธอม', 'แฟทอม', 'แฟธอม'],
		explanation: 'หน่วยวัดระยะทาง',
		isLoanWord: true
	},
	{
		correct: 'ฟิล์ม',
		incorrect: ['ฟิลม์', 'ฟลิม', 'ฟิมล์', 'ฟิม์ล'],
		explanation: '',
		isLoanWord: true
	},
	{
		correct: 'ฟิวส์',
		incorrect: ['ฟิว'],
		explanation: '',
		isLoanWord: true
	},
	{
		correct: 'ฟุตบอล',
		incorrect: ['ฟุทบอล'],
		explanation: '',
		isLoanWord: true
	},
	{
		correct: 'ฟุลสแก๊ป',
		incorrect: ['ฟูลสแกป'],
		explanation: 'หน้ากระดาษที่มีเส้นบรรทัด',
		isLoanWord: true
	},
	{
		correct: 'เฟซบุ๊ก',
		incorrect: ['เฟสบุ๊ก'],
		explanation: 'ทับศัพท์จาก Facebook',
		isLoanWord: true
	},
	{
		correct: 'เฟิน',
		incorrect: ['เฟิร์น'],
		explanation: 'ถ้านำไปเขียนคำทับศัพท์อาจอนุโลมใช้ เฟิร์น ได้',
		isLoanWord: true
	},
	{
		correct: 'แฟชั่น',
		incorrect: ['แฟชัน'],
		explanation: 'มีไม้เอก',
		isLoanWord: true
	},
	{
		correct: 'ไฟแช็ก',
		incorrect: ['ไฟแชค', 'ไฟแช็ค'],
		explanation: '',
		isLoanWord: true
	},
	{
		correct: 'ภคินี',
		incorrect: ['ภคิณี'],
		explanation: '',
		isLoanWord: false
	},
	{
		correct: 'ภวังค์',
		incorrect: ['พวังศ์'],
		explanation: '',
		isLoanWord: false
	},
	{
		correct: 'ภัณฑารักษ์',
		incorrect: ['พันธารักษ์'],
		explanation: '',
		isLoanWord: false
	},
	{
		correct: 'ภาคทัณฑ์',
		incorrect: ['ภาคฑัณฑ์'],
		explanation: '',
		isLoanWord: false
	},
	{
		correct: 'ภาคภูมิ',
		incorrect: ['พากพูม'],
		explanation: '',
		isLoanWord: false
	},
	{
		correct: 'ภาพยนตร์',
		incorrect: ['ภาพยนต์'],
		explanation: '',
		isLoanWord: false
	},
	{
		correct: 'ภาวการณ์',
		incorrect: ['ภาวะการณ์', 'ภาวะการ'],
		explanation: '',
		isLoanWord: false
	},
	{
		correct: 'ภาววิสัย',
		incorrect: ['ภาวะวิสัย'],
		explanation:
			'"ภาววิสัย" ตรงกับภาษาอังกฤษว่า "objective" บางทีใช้ "ปรนัย" (ปะระไน), "ปรวิสัย" (ปะระวิสัย) หรือ "วัตถุวิสัย" หมายความว่า "ที่เกี่ยวข้องกับวัตถุ โดยไม่เกี่ยวกับความคิดหรือความรู้สึก"',
		isLoanWord: true
	},
	{
		correct: 'ภุชงค์',
		incorrect: ['พุชงค์'],
		explanation: '',
		isLoanWord: false
	},
	{
		correct: 'ภูตผี',
		incorrect: ['ภูติผี'],
		explanation: '',
		isLoanWord: false
	},
	{
		correct: 'ภูมิใจ',
		incorrect: ['พูมใจ', 'ภูมใจ'],
		explanation: '',
		isLoanWord: false
	},
	{
		correct: 'ภูมิลำเนา',
		incorrect: ['ภูมลำเนา'],
		explanation: '',
		isLoanWord: false
	},
	{
		correct: 'เภตรา',
		incorrect: ['เพตรา'],
		explanation: '',
		isLoanWord: false
	},
	{
		correct: 'มกุฎราชกุมาร',
		incorrect: ['มกุฏราชกุมาร', 'มงกุฎราชกุมาร'],
		explanation: 'ใช้ ฎ ชฎา',
		isLoanWord: false
	},
	{
		correct: 'มงกุฎ',
		incorrect: ['มงกุฏ'],
		explanation: 'ใช้ ฎ ชฎา',
		isLoanWord: false
	},
	{
		correct: 'มณฑป',
		incorrect: ['มนฑป', 'มณทป'],
		explanation: 'อ่านว่า มน-ดบ',
		isLoanWord: false
	},
	{
		correct: 'มนเทียร',
		incorrect: ['มนเฑียร', 'มณเฑียร'],
		explanation: '',
		isLoanWord: false
	},
	{
		correct: 'มรณภาพ',
		incorrect: ['มรณะภาพ'],
		explanation: '',
		isLoanWord: false
	},
	{
		correct: 'มฤตยู',
		incorrect: ['มรึตยู'],
		explanation: '',
		isLoanWord: false
	},
	{
		correct: 'มลทิน',
		incorrect: ['มนทิน'],
		explanation: '',
		isLoanWord: false
	},
	{
		correct: 'มลังเมลือง',
		incorrect: ['มะลังมะเลือง'],
		explanation: '',
		isLoanWord: false
	},
	{
		correct: 'มหรรณพ',
		incorrect: ['มหรรนพ', 'มหันนพ'],
		explanation: '',
		isLoanWord: false
	},
	{
		correct: 'มหรสพ',
		incorrect: ['มหรศพ'],
		explanation: 'อ่านว่า มะ-หอ-ระ-สบ',
		isLoanWord: false
	},
	{
		correct: 'มหัศจรรย์',
		incorrect: ['มหรรศจรรย์'],
		explanation: '',
		isLoanWord: false
	},
	{
		correct: 'มหาหิงคุ์',
		incorrect: ['มหาหิงค์'],
		explanation: '',
		isLoanWord: false
	},
	{
		correct: 'มเหสักข์',
		incorrect: ['มเหศักดิ์'],
		explanation: '',
		isLoanWord: false
	},
	{
		correct: 'มเหสี',
		incorrect: ['เมหสี'],
		explanation: '',
		isLoanWord: false
	},
	{
		correct: 'มไหศวรรย์',
		incorrect: ['มไหสวรรค์'],
		explanation: '',
		isLoanWord: false
	},
	{
		correct: 'หม้อห้อม',
		incorrect: ['หม้อฮ่อม'],
		explanation: '',
		isLoanWord: false
	},
	{
		correct: 'มะหะหมัด',
		incorrect: ['มหะหมัด', 'มะหะมัด'],
		explanation: '',
		isLoanWord: false
	},
	{
		correct: 'มัคคุเทศก์',
		incorrect: ['มัคคุเทศ', 'มัคคุเทศน์'],
		explanation: '',
		isLoanWord: false
	},
	{
		correct: 'มัคนายก',
		incorrect: ['มัคทายก'],
		explanation:
			'สะกด "มรรคนายก" ได้ (บาลี) มคฺค + นายก (สันสกฤต) มารฺค + นายก หมายถึง ผู้นำทาง ได้แก่ ผู้จัดการทางกุศล หรือผู้ชี้แจงทางบุญทางกุศลและป่าวประกาศให้ประชาชนมาทำบุญทำกุศลในวัด',
		isLoanWord: false
	},
	{
		correct: 'มัณฑนศิลป์',
		incorrect: ['มันทนศิลป์', 'มันฑณศิลป์'],
		explanation: '',
		isLoanWord: false
	},
	{
		correct: 'มัธยัสถ์',
		incorrect: ['มัธยัสต์'],
		explanation: '',
		isLoanWord: false
	},
	{
		correct: 'มัศยา',
		incorrect: ['มัสยา'],
		explanation: 'ปลา',
		isLoanWord: false
	},
	{
		correct: 'มัสตาร์ด',
		incorrect: ['มัสตาด'],
		explanation: '',
		isLoanWord: true
	},
	{
		correct: 'มัสมั่น',
		incorrect: ['มัสหมั่น'],
		explanation: 'อ่านว่า มัด-สะ-หมั่น',
		isLoanWord: false
	},
	{
		correct: 'มาตรการ',
		incorrect: ['มาตราการ'],
		explanation: '',
		isLoanWord: false
	},
	{
		correct: 'มาตรฐาน',
		incorrect: ['มาตราฐาน'],
		explanation: '',
		isLoanWord: false
	},
	{
		correct: 'มานุษยวิทยา',
		incorrect: ['มนุษยวิทยา'],
		explanation: 'มานุษย = ที่เกี่ยวกับมนุษย์',
		isLoanWord: false
	},
	{
		correct: 'ม่าเหมี่ยว',
		incorrect: ['มะเหมี่ยว'],
		explanation: 'ด้วงปีกแข็งชนิดหนึ่ง, ชมพู่ผลสีแดงเข้ม',
		isLoanWord: false
	},
	{
		correct: 'มึง',
		incorrect: ['เมิง'],
		explanation: '',
		isLoanWord: false
	},
	{
		correct: 'มืดมน',
		incorrect: ['มืดมนต์', 'มืดมล'],
		explanation: '',
		isLoanWord: false
	},
	{
		correct: 'มุกตลก',
		incorrect: ['มุขตลก'],
		explanation: 'ราชบัณฑิตยสถานสะกดว่า มุก ในขณะที่พจนานุกรมฉบับมติชนสะกดว่า มุข',
		isLoanWord: false
	},
	{
		correct: 'แมงมุม',
		incorrect: ['แมลงมุม'],
		explanation: '',
		isLoanWord: false
	},
	{
		correct: 'แมลงดา',
		incorrect: ['แมงดา'],
		explanation: 'เฉพาะแมลง(มี 6 ขา)  ส่วนแมงดาจะใช้กับแมงดาทะเล (มี 12 ขา)',
		isLoanWord: false
	},
	{
		correct: 'แมลงภู่',
		incorrect: ['แมลงพู่', 'แมงภู่'],
		explanation: 'ทั้งชื่อแมลงและหอย',
		isLoanWord: false
	},
	{
		correct: 'แมลงวัน',
		incorrect: ['แมงวัน'],
		explanation: '',
		isLoanWord: false
	},
	{
		correct: 'แมลงสาบ',
		incorrect: ['แมลงสาป', 'แมงสาบ', 'แมงสาป'],
		explanation: '',
		isLoanWord: false
	},
	{
		correct: 'ไมล์',
		incorrect: ['ไมร์', 'ไมค์'],
		explanation: 'หน่วยวัดระยะทาง',
		isLoanWord: true
	},
	{
		correct: 'ยศถาบรรดาศักดิ์',
		incorrect: ['ยศฐาบรรดาศักดิ์'],
		explanation: '',
		isLoanWord: false
	},
	{
		correct: 'ย่อมเยา',
		incorrect: ['ย่อมเยาว์'],
		explanation: 'ราคาย่อมเยา',
		isLoanWord: false
	},
	{
		correct: 'ยาเกร็ด',
		incorrect: ['ยาเกล็ด'],
		explanation: 'หมายถึง ตำรา',
		isLoanWord: false
	},
	{
		correct: 'ยานัตถุ์',
		incorrect: ['ยานัตถ์', 'ยานัด'],
		explanation: '',
		isLoanWord: false
	},
	{
		correct: 'ยีราฟ',
		incorrect: ['จีราฟ'],
		explanation: '',
		isLoanWord: true
	},
	{
		correct: 'เยอรมนี',
		incorrect: ['เยอรมันนี'],
		explanation: '',
		isLoanWord: true
	},
	{
		correct: 'เยาว์วัย',
		incorrect: ['เยาวัย'],
		explanation: '',
		isLoanWord: false
	},
	{
		correct: 'เยื่อใย',
		incorrect: ['เยื่อไย'],
		explanation: 'คำซ้อน เยื่อ + ใย',
		isLoanWord: false
	},
	{
		correct: 'ใยแมงมุม',
		incorrect: ['ไยแมงมุม'],
		explanation: '',
		isLoanWord: false
	},
	{
		correct: 'ไย',
		incorrect: ['ใย'],
		explanation: 'หมายถึงไฉน, อะไร, ทำไม',
		isLoanWord: false
	},
	{
		correct: 'ไยดี',
		incorrect: ['ใยดี'],
		explanation: '',
		isLoanWord: false
	},
	{
		correct: 'ไยไพ',
		incorrect: ['ใยไพ'],
		explanation: 'หมายถึงเยาะเย้ย, พูดให้อาย',
		isLoanWord: false
	},
	{
		correct: 'รกชัฏ',
		incorrect: ['รกชัฎ'],
		explanation: 'ใช้ ฏ ปฏัก',
		isLoanWord: false
	},
	{
		correct: 'รณรงค์',
		incorrect: ['รนรงค์'],
		explanation: '',
		isLoanWord: false
	},
	{
		correct: 'รถยนต์',
		incorrect: ['รถยนตร์'],
		explanation: '',
		isLoanWord: false
	},
	{
		correct: 'รมณีย์',
		incorrect: ['รมนีย์', 'รมณี'],
		explanation: '',
		isLoanWord: false
	},
	{
		correct: 'รสชาติ',
		incorrect: ['รสชาด'],
		explanation: '',
		isLoanWord: false
	},
	{
		correct: 'ร้องไห้',
		incorrect: ['ร้องให้'],
		explanation: '',
		isLoanWord: false
	},
	{
		correct: 'ระบบนิเวศ',
		incorrect: ['ระบบนิเวศน์'],
		explanation: '',
		isLoanWord: false
	},
	{
		correct: 'ระเบงเซ็งแซ่',
		incorrect: ['ระเบ็งเซ็งแซ่'],
		explanation: '',
		isLoanWord: false
	},
	{
		correct: 'ระเห็จ',
		incorrect: ['รเห็จ', 'เรห็จ'],
		explanation: '',
		isLoanWord: false
	},
	{
		correct: 'รักษาการ',
		incorrect: ['รักษาการณ์'],
		explanation: 'ปฏิบัติหน้าที่แทน เช่น รักษาการในตำแหน่ง...',
		isLoanWord: false
	},
	{
		correct: 'รักษาการณ์',
		incorrect: ['รักษาการ'],
		explanation: 'เฝ้าดูแลเหตุการณ์ เช่น ยามรักษาการณ์',
		isLoanWord: false
	},
	{
		correct: 'รังเกียจ',
		incorrect: ['รังเกลียด', 'รังเกียด'],
		explanation: '',
		isLoanWord: false
	},
	{
		correct: 'รังควาน',
		incorrect: ['รังควาญ'],
		explanation: '',
		isLoanWord: false
	},
	{
		correct: 'รังสี',
		incorrect: ['รังษี', 'รังศี'],
		explanation: 'ยกเว้นชื่อเฉพาะ',
		isLoanWord: false
	},
	{
		correct: 'รัญจวน',
		incorrect: ['รัญจวญ', 'รัญจวณ'],
		explanation: '',
		isLoanWord: false
	},
	{
		correct: 'รัฐวิสาหกิจ',
		incorrect: ['รัฐวิสาหะกิจ'],
		explanation: '',
		isLoanWord: false
	},
	{
		correct: 'รัศมี',
		incorrect: ['รัสมี', 'รัษมี'],
		explanation: '',
		isLoanWord: false
	},
	{
		correct: 'รากเหง้า',
		incorrect: ['รากเง่า'],
		explanation: 'เง่า หมายถึงโง่เง่า',
		isLoanWord: false
	},
	{
		correct: 'ราชภัฏ',
		incorrect: ['ราชภัฎ'],
		explanation: 'ใช้ ฏ ปฏัก',
		isLoanWord: false
	},
	{
		correct: 'ราชัน',
		incorrect: ['ราชันย์'],
		explanation: '"ราชัน" หมายถึง พระเจ้าแผ่นดิน, "ราชันย์" หมายถึง เชื้อสายของพระเจ้าแผ่นดิน',
		isLoanWord: false
	},
	{
		correct: 'ราดหน้า',
		incorrect: ['ลาดหน้า'],
		explanation: '',
		isLoanWord: false
	},
	{
		correct: 'ราพณาสูร',
		incorrect: ['ราพนาสูร'],
		explanation: '',
		isLoanWord: false
	},
	{
		correct: 'รำคาญ',
		incorrect: ['รำคราญ', 'รำคาน'],
		explanation: '',
		isLoanWord: false
	},
	{
		correct: 'ริบบิ้น',
		incorrect: ['ริ้บบิ้น'],
		explanation: 'ออกเสียง ริบ โดยไม่มีรูปวรรณยุกต์',
		isLoanWord: false
	},
	{
		correct: 'รื่นรมย์',
		incorrect: ['รื่นรมณ์'],
		explanation: '',
		isLoanWord: false
	},
	{
		correct: 'เรี่ยไร',
		incorrect: ['เรี่ยราย'],
		explanation: 'เรี่ยราย = เกลื่อนกลาด',
		isLoanWord: false
	},
	{
		correct: 'แร็กเกต',
		incorrect: ['แร็กเก็ต'],
		explanation: '',
		isLoanWord: true
	},
	{
		correct: 'โรงธารคำนัล',
		incorrect: ['โรงธารกำนัล'],
		explanation: 'หมายถึง ท้องพระโรง',
		isLoanWord: false
	},
	{
		correct: 'โรมันคาทอลิก',
		incorrect: ['โรมันคาธอลิค'],
		explanation: '',
		isLoanWord: true
	},
	{
		correct: 'ฤกษ์พานาที',
		incorrect: ['ฤกษ์ผานาที'],
		explanation: 'สองคำที่สับสน คือ "ฤกษ์พานาที" กับ "เลขผานาที"',
		isLoanWord: false
	},
	{
		correct: 'ฤทธิ์',
		incorrect: ['ฤทธ', 'ฤทธ์'],
		explanation: '',
		isLoanWord: false
	},
	{
		correct: 'ฤๅ',
		incorrect: ['ฤา'],
		explanation: 'ใช้ลากข้างยาว',
		isLoanWord: false
	},
	{
		correct: 'ฤๅษี',
		incorrect: ['ฤาษี'],
		explanation: 'ใช้ลากข้างยาว',
		isLoanWord: false
	},
	{
		correct: 'ลดาวัลย์',
		incorrect: ['ลัดดาวัลย์', 'ลดาวัณย์'],
		explanation: 'ชื่อไม้เถาชนิดหนึ่ง ยกเว้นชื่อเฉพาะ',
		isLoanWord: false
	},
	{
		correct: 'ลมปราณ',
		incorrect: ['ลมปราน'],
		explanation: '',
		isLoanWord: false
	},
	{
		correct: 'ลมหวน',
		incorrect: ['ลมหวล'],
		explanation: '',
		isLoanWord: false
	},
	{
		correct: 'ล็อกเกต',
		incorrect: ['ล็อกเก็ต'],
		explanation: '',
		isLoanWord: true
	},
	{
		correct: 'ลองไน',
		incorrect: ['ลองใน'],
		explanation: 'ชื่อจักจั่นขนาดใหญ่ชนิดหนึ่ง',
		isLoanWord: false
	},
	{
		correct: 'ละคร',
		incorrect: ['ละคอน'],
		explanation:
			'"ละคอน" เป็นคำไทยโบราณ ใช้เมื่อต้องการรักษาความดั้งเดิมไว้ เช่น สาขาศิลปะและการละคอน',
		isLoanWord: false
	},
	{
		correct: 'ละเมียดละไม',
		incorrect: ['ลเมียดลไม'],
		explanation: '',
		isLoanWord: false
	},
	{
		correct: 'ละโมบ',
		incorrect: ['ลโมบ', 'ละโมภ'],
		explanation: '',
		isLoanWord: false
	},
	{
		correct: 'ละเอียดลออ',
		incorrect: ['ลเอียดลออ', 'ละเอียดละออ'],
		explanation: '',
		isLoanWord: false
	},
	{
		correct: 'ลักเพศ',
		incorrect: ['ลักเพท', 'ลักเพส'],
		explanation: '',
		isLoanWord: false
	},
	{
		correct: 'ลังถึง',
		incorrect: ['รังถึง'],
		explanation: '',
		isLoanWord: false
	},
	{
		correct: 'ลาดตระเวน',
		incorrect: ['ลาดตระเวณ'],
		explanation: 'มักสับสนกับ "บริเวณ"',
		isLoanWord: false
	},
	{
		correct: 'ลาดยาง',
		incorrect: ['ราดยาง'],
		explanation: 'เรียกถนนที่ปูผิวจราจรด้วยยางมะตอยผสมกับหินหรือทรายเป็นต้นว่า "ถนนลาดยาง"',
		isLoanWord: false
	},
	{
		correct: 'ลายเซ็น',
		incorrect: ['ลายเซ็นต์'],
		explanation: '',
		isLoanWord: true
	},
	{
		correct: 'ลาวัณย์',
		incorrect: ['ลาวัลย์'],
		explanation: 'หมายถึง ความงาม ความน่ารัก',
		isLoanWord: false
	},
	{
		correct: 'ลำไย',
		incorrect: ['ลำใย'],
		explanation: 'คำนอกกฎการใช้ไม้ม้วน',
		isLoanWord: false
	},
	{
		correct: 'ลำไส้',
		incorrect: ['ลำใส้'],
		explanation: 'คำนอกกฎการใช้ไม้ม้วน',
		isLoanWord: false
	},
	{
		correct: 'ลิดรอนสิทธิ์',
		incorrect: ['ริดรอนสิทธิ์'],
		explanation: '',
		isLoanWord: false
	},
	{
		correct: 'ลิปสติก',
		incorrect: ['ลิปสติค'],
		explanation: '',
		isLoanWord: false
	},
	{
		correct: 'ลิฟต์',
		incorrect: ['ลิปต์', 'ลิฟ', 'ลิฟท์'],
		explanation: 'มาจากคำภาษาอังกฤษ lift',
		isLoanWord: true
	},
	{
		correct: 'ลือชา',
		incorrect: ['ฦๅชา'],
		explanation: 'ฦ ฦๅ ไม่มีที่ใช้ในปัจจุบัน',
		isLoanWord: false
	},
	{
		correct: 'ลุกลี้ลุกลน',
		incorrect: ['ลุกลี้ลุกรน'],
		explanation: '',
		isLoanWord: false
	},
	{
		correct: 'ลูกเกด',
		incorrect: ['ลูกเกตุ'],
		explanation: '',
		isLoanWord: false
	},
	{
		correct: 'ลูกนิมิต',
		incorrect: ['ลูกนิมิตร'],
		explanation: '',
		isLoanWord: false
	},
	{
		correct: 'ลูกบาศก์',
		incorrect: ['ลูกบาศ'],
		explanation: '',
		isLoanWord: false
	},
	{
		correct: 'เล่นพิเรนทร์',
		incorrect: ['เล่นพิเรนท์'],
		explanation: '',
		isLoanWord: false
	},
	{
		correct: 'เลย',
		incorrect: ['เรย'],
		explanation: '',
		isLoanWord: false
	},
	{
		correct: 'เล่ห์กระเท่ห์',
		incorrect: ['เล่กระเท่'],
		explanation: '',
		isLoanWord: false
	},
	{
		correct: 'เลือกสรร',
		incorrect: ['เลือกสรรค์'],
		explanation: '',
		isLoanWord: false
	},
	{
		correct: 'เลือดกบปาก',
		incorrect: ['เลือดกลบปาก'],
		explanation: '',
		isLoanWord: false
	},
	{
		correct: 'โล่',
		incorrect: ['โล่ห์'],
		explanation: 'มิได้แผลงมาจาก "โลหะ"',
		isLoanWord: false
	},
	{
		correct: 'โลกาภิวัตน์',
		incorrect: ['โลกาภิวัฒน์'],
		explanation: '',
		isLoanWord: false
	},
	{
		correct: 'ไล่เลียง',
		incorrect: ['ไล่เรียง', 'ไร่เรียง', 'ไร่เลียง'],
		explanation: 'ซักไซ้ ไต่ถาม มักใช้ว่า ซักไซ้ไล่เลียง',
		isLoanWord: false
	},
	{
		correct: 'วงศ์วาน',
		incorrect: ['วงษ์วาน'],
		explanation: 'เช่น ชื่อถนน งามวงศ์วาน',
		isLoanWord: false
	},
	{
		correct: 'วัคซีน',
		incorrect: ['วักซีน'],
		explanation: '',
		isLoanWord: true
	},
	{
		correct: 'วัณโรค',
		incorrect: ['วันโรค', 'วรรณโรค'],
		explanation: '',
		isLoanWord: false
	},
	{
		correct: 'วันทยหัตถ์',
		incorrect: ['วันทยาหัตถ์'],
		explanation: '',
		isLoanWord: false
	},
	{
		correct: 'วันทยาวุธ',
		incorrect: ['วันทยวุธ'],
		explanation: '',
		isLoanWord: false
	},
	{
		correct: 'วางก้าม',
		incorrect: ['วางกล้าม'],
		explanation: 'วางโต',
		isLoanWord: false
	},
	{
		correct: 'วาทกรรม',
		incorrect: ['วาทะกรรม'],
		explanation: 'สมาสแล้วไม่มีสระอะ',
		isLoanWord: false
	},
	{
		correct: 'วายชนม์',
		incorrect: ['วายชน'],
		explanation: '',
		isLoanWord: false
	},
	{
		correct: 'วารดิถี',
		incorrect: ['วาระดิถี'],
		explanation: 'สมาสแล้วไม่มีสระอะ',
		isLoanWord: false
	},
	{
		correct: 'วาฬ',
		incorrect: ['วาล'],
		explanation: '',
		isLoanWord: false
	},
	{
		correct: 'วิ่งเปี้ยว',
		incorrect: ['วิ่งเปรี้ยว'],
		explanation: '',
		isLoanWord: false
	},
	{
		correct: 'วิ่งผลัด',
		incorrect: ['วิ่งผัด'],
		explanation: '',
		isLoanWord: false
	},
	{
		correct: 'วิตถาร',
		incorrect: ['วิตถาน', 'วิตถาล'],
		explanation: '',
		isLoanWord: false
	},
	{
		correct: 'วิตามิน',
		incorrect: ['วิตตามิน', 'วิตะมิน'],
		explanation: '',
		isLoanWord: true
	},
	{
		correct: 'วินาที',
		incorrect: ['วินาฑี'],
		explanation: '',
		isLoanWord: false
	},
	{
		correct: 'วินาศกรรม',
		incorrect: ['วินาศะกรรม'],
		explanation: '',
		isLoanWord: false
	},
	{
		correct: 'วิหารคด',
		incorrect: ['วิหารคต'],
		explanation: '',
		isLoanWord: false
	},
	{
		correct: 'วิญญาณ',
		incorrect: ['วิญญาน'],
		explanation: '',
		isLoanWord: false
	},
	{
		correct: 'เวทมนตร์',
		incorrect: ['เวทย์มนตร์', 'เวทมนต์'],
		explanation: '',
		isLoanWord: false
	},
	{
		correct: 'เวนคืน',
		incorrect: ['เวรคืน'],
		explanation: '',
		isLoanWord: false
	},
	{
		correct: 'เวียดนาม',
		incorrect: ['เวียตนาม'],
		explanation: '',
		isLoanWord: false
	},
	{
		correct: 'เว็บไซต์',
		incorrect: ['เว็บไซท์'],
		explanation: 'ทับศัพท์จาก website',
		isLoanWord: true
	},
	{
		correct: 'ไวยากรณ์',
		incorrect: ['ไวยกรณ์'],
		explanation: '',
		isLoanWord: false
	},
	{
		correct: 'ศรัทธา',
		incorrect: ['ศัทธา'],
		explanation: 'สะกด "สัทธา" ก็ได้ นิยมใช้ "ศรัทธา" มากกว่า',
		isLoanWord: false
	},
	{
		correct: 'ศศิธร',
		incorrect: ['สสิธร', 'ศศิทร'],
		explanation: 'ศศิธร หมายถึง ดวงจันทร์',
		isLoanWord: false
	},
	{
		correct: 'ศักย์',
		incorrect: ['ศักดิ์'],
		explanation: 'ศักย์ ที่หมายถึง ศักย์ไฟฟ้า ศักยภาพ ใช้ ย แต่ ศักดิ์ที่กล่าวถึง ศักดินา ใช้ ด',
		isLoanWord: false
	},
	{
		correct: 'ศัตรู',
		incorrect: ['สัตรู', 'ศตรู'],
		explanation: '',
		isLoanWord: false
	},
	{
		correct: 'ศัพท์',
		incorrect: ['ศัพย์'],
		explanation: '',
		isLoanWord: false
	},
	{
		correct: '-ศาสตรดุษฎีบัณฑิต',
		incorrect: ['-ศาสตร์ดุษฎีบัณฑิต'],
		explanation: 'ปริญญาเอก เช่น รัฐศาสตรดุษฎีบัณฑิต',
		isLoanWord: false
	},
	{
		correct: '-ศาสตรบัณฑิต',
		incorrect: ['-ศาสตร์บัณฑิต'],
		explanation: 'ปริญญาตรี เช่น เศรษฐศาสตรบัณฑิต',
		isLoanWord: false
	},
	{
		correct: '-ศาสตรมหาบัณฑิต',
		incorrect: ['-ศาสตร์มหาบัณฑิต'],
		explanation: 'ปริญญาโท เช่น นิติศาสตรมหาบัณฑิต',
		isLoanWord: false
	},
	{
		correct: 'ศิลปะ',
		incorrect: ['ศิลป'],
		explanation: 'สะกด "ศิลป์" ได้ ใช้เป็นศัพท์โดด',
		isLoanWord: false
	},
	{
		correct: 'ศิลปกรรม',
		incorrect: ['ศิลปะกรรม'],
		explanation: 'คำสมาส',
		isLoanWord: false
	},
	{
		correct: 'ศิลปวัฒนธรรม',
		incorrect: ['ศิลปะวัฒนธรรม'],
		explanation: 'หากต้องการแยกคำควรใช้ "ศิลปะและวัฒนธรรม"',
		isLoanWord: false
	},
	{
		correct: 'ศิลปวัตถุ',
		incorrect: ['ศิลปะวัตถุ'],
		explanation: 'คำสมาส',
		isLoanWord: false
	},
	{
		correct: 'ศีรษะ',
		incorrect: ['ศรีษะ'],
		explanation: '',
		isLoanWord: false
	},
	{
		correct: 'ศึกษานิเทศก์',
		incorrect: ['ศึกษานิเทศ', 'ศึกษานิเทศน์'],
		explanation: '',
		isLoanWord: false
	},
	{
		correct: 'โศกนาฏกรรม',
		incorrect: ['โศกะนาฏกรรม', 'โศกนาฎกรรม'],
		explanation: 'ใช้ ฏ ปฏัก',
		isLoanWord: false
	},
	{
		correct: 'โศกศัลย์',
		incorrect: ['โสกศัลย์', 'โศกสันต์'],
		explanation: '',
		isLoanWord: false
	},
	{
		correct: 'โศกเศร้า',
		incorrect: ['โสกเศร้า'],
		explanation: '',
		isLoanWord: false
	},
	{
		correct: 'ไศล',
		incorrect: ['ไสล', 'ศไล'],
		explanation: 'หมายถึง เขาหิน',
		isLoanWord: false
	},
	{
		correct: 'สกัด',
		incorrect: ['สะกัด'],
		explanation: '',
		isLoanWord: false
	},
	{
		correct: 'สกาว',
		incorrect: ['สะกาว'],
		explanation: '',
		isLoanWord: false
	},
	{
		correct: 'สแกน',
		incorrect: ['แสกน'],
		explanation: '',
		isLoanWord: false
	},
	{
		correct: 'สดับ',
		incorrect: ['สะดับ'],
		explanation: '',
		isLoanWord: false
	},
	{
		correct: 'สถานการณ์',
		incorrect: ['สถานการ', 'สถานะการณ์'],
		explanation: '',
		isLoanWord: false
	},
	{
		correct: 'สถิต',
		incorrect: ['สถิตย์'],
		explanation: 'ยกเว้น "สถิตยศาสตร์"',
		isLoanWord: false
	},
	{
		correct: 'สถุล',
		incorrect: ['สถุน'],
		explanation: '',
		isLoanWord: false
	},
	{
		correct: 'สนนราคา',
		incorrect: ['สงวนราคา'],
		explanation: '"สนนราคา" หมายถึง ราคา ; "สงวนราคา" หมายถึง รักษาระดับราคาไว้',
		isLoanWord: false
	},
	{
		correct: 'สบง',
		incorrect: ['สะบง'],
		explanation: '',
		isLoanWord: false
	},
	{
		correct: 'สบาย',
		incorrect: ['สะบาย'],
		explanation: '',
		isLoanWord: false
	},
	{
		correct: 'สบู่',
		incorrect: ['สะบู่'],
		explanation: '',
		isLoanWord: false
	},
	{
		correct: 'สไบ',
		incorrect: ['สะไบ', 'ไสบ'],
		explanation: '',
		isLoanWord: false
	},
	{
		correct: 'สมดุล',
		incorrect: ['สมดุลย์'],
		explanation: '',
		isLoanWord: false
	},
	{
		correct: 'สมเพช',
		incorrect: ['สมเพท', 'สมเพศ', 'สมเพส'],
		explanation: '',
		isLoanWord: false
	},
	{
		correct: 'สรรเพชญ',
		incorrect: ['สรรเพชร'],
		explanation: '',
		isLoanWord: false
	},
	{
		correct: 'สรรแสร้ง',
		incorrect: ['สรรค์แสร้ง'],
		explanation: '',
		isLoanWord: false
	},
	{
		correct: 'สรรหา',
		incorrect: ['สรรค์หา'],
		explanation: 'สรรค์ หมายถึง สร้าง, ทำให้เกิดขึ้น',
		isLoanWord: false
	},
	{
		correct: 'สรวงสวรรค์',
		incorrect: ['สวงสวรรค์'],
		explanation: '',
		isLoanWord: false
	},
	{
		correct: 'สร้างสรรค์',
		incorrect: ['สร้างสรร'],
		explanation: '',
		isLoanWord: false
	},
	{
		correct: 'สวรรคต',
		incorrect: ['สวรรณคต'],
		explanation: '',
		isLoanWord: false
	},
	{
		correct: 'สอบเชาวน์',
		incorrect: ['สอบเชาว์'],
		explanation: '',
		isLoanWord: false
	},
	{
		correct: 'สะกด',
		incorrect: ['สกด'],
		explanation: '',
		isLoanWord: false
	},
	{
		correct: 'สะกิด',
		incorrect: ['สกิด'],
		explanation: '',
		isLoanWord: false
	},
	{
		correct: 'สะคราญ',
		incorrect: ['สคราญ'],
		explanation: '',
		isLoanWord: false
	},
	{
		correct: 'สะดวก',
		incorrect: ['สดวก'],
		explanation: '',
		isLoanWord: false
	},
	{
		correct: 'สะพรึงกลัว',
		incorrect: ['สะพึงกลัว'],
		explanation: '',
		isLoanWord: false
	},
	{
		correct: 'สะพาน',
		incorrect: ['สพาน'],
		explanation: '',
		isLoanWord: false
	},
	{
		correct: 'สะเหล่อ',
		incorrect: ['สะเหร่อ', 'เสร่อ', 'เสล่อ'],
		explanation: '',
		isLoanWord: false
	},
	{
		correct: 'สะอาด',
		incorrect: ['สอาด'],
		explanation: '',
		isLoanWord: false
	},
	{
		correct: 'สักการบูชา',
		incorrect: ['สักการะบูชา'],
		explanation: 'คำสมาส',
		isLoanWord: false
	},
	{
		correct: 'สักครู่',
		incorrect: ['ซักครู่'],
		explanation: '',
		isLoanWord: false
	},
	{
		correct: 'สังเกต',
		incorrect: ['สังเกตุ'],
		explanation: '',
		isLoanWord: false
	},
	{
		correct: 'สังเขป',
		incorrect: ['สังเขบ'],
		explanation: '',
		isLoanWord: false
	},
	{
		correct: 'สังวร',
		incorrect: ['สังวรณ์'],
		explanation: '',
		isLoanWord: false
	},
	{
		correct: 'สังวาล',
		incorrect: ['สังวาลย์'],
		explanation: 'ยกเว้นชื่อเฉพาะ "สังวาลย์"',
		isLoanWord: false
	},
	{
		correct: 'สังสรรค์',
		incorrect: ['สังสรร'],
		explanation: '',
		isLoanWord: false
	},
	{
		correct: 'สัญลักษณ์',
		incorrect: ['สัญลักษ์', 'สัญญลักษณ์'],
		explanation: '',
		isLoanWord: false
	},
	{
		correct: 'สัณฐาน',
		incorrect: ['สันฐาน', 'สันฐาณ', 'สัณฐาณ'],
		explanation: 'รูปพรรณสัณฐาน',
		isLoanWord: false
	},
	{
		correct: 'สันโดษ',
		incorrect: ['สัญโดษ'],
		explanation: '',
		isLoanWord: false
	},
	{
		correct: 'สันนิษฐาน',
		incorrect: ['สันนิฐาน', 'สันนิฐาณ'],
		explanation: '',
		isLoanWord: false
	},
	{
		correct: 'สับปลับ',
		incorrect: ['สัปลับ'],
		explanation: '',
		isLoanWord: false
	},
	{
		correct: 'สับปะรด',
		incorrect: ['สัปรด', 'สัปปะรด', 'สับปะรส'],
		explanation: 'มิได้แผลงมาจาก สรรพรส',
		isLoanWord: false
	},
	{
		correct: 'สัปเหร่อ',
		incorrect: ['สัพเหร่อ', 'สัปปะเหร่อ'],
		explanation: '',
		isLoanWord: false
	},
	{
		correct: 'สัพยอก',
		incorrect: ['สรรพยอก'],
		explanation: '',
		isLoanWord: false
	},
	{
		correct: 'สัมภาษณ์',
		incorrect: ['สัมภาษ', 'สัมภาสน์'],
		explanation: '',
		isLoanWord: false
	},
	{
		correct: 'สัมมนา',
		incorrect: ['สัมนา', 'สำมะนา'],
		explanation: '',
		isLoanWord: false
	},
	{
		correct: 'สาทร',
		incorrect: ['สาธร'],
		explanation: 'ชื่อถนนสายหนึ่ง และเขตการปกครองในกรุงเทพมหานคร',
		isLoanWord: false
	},
	{
		correct: 'สาธารณชน',
		incorrect: ['สาธารณะชน'],
		explanation: 'คำสมาส',
		isLoanWord: false
	},
	{
		correct: 'สาธารณประโยชน์',
		incorrect: ['สาธารณะประโยชน์'],
		explanation: 'คำสมาส',
		isLoanWord: false
	},
	{
		correct: 'สาธารณสถาน',
		incorrect: ['สาธารณะสถาน'],
		explanation: 'คำสมาส',
		isLoanWord: false
	},
	{
		correct: 'สาธารณสุข',
		incorrect: ['สาธารณะสุข'],
		explanation: 'คำสมาส',
		isLoanWord: false
	},
	{
		correct: 'สาบสูญ',
		incorrect: ['สาปสูญ'],
		explanation: '',
		isLoanWord: false
	},
	{
		correct: 'สาบาน',
		incorrect: ['สาบาญ'],
		explanation: '',
		isLoanWord: false
	},
	{
		correct: 'สาปแช่ง',
		incorrect: ['สาบแช่ง'],
		explanation: '',
		isLoanWord: false
	},
	{
		correct: 'สาปสรร',
		incorrect: ['สาบสรร'],
		explanation: '',
		isLoanWord: false
	},
	{
		correct: 'สามเส้า',
		incorrect: ['สามเศร้า'],
		explanation: 'เส้า หมายถึง ไม้หลักหรือวัตถุที่ตั้งหรือปักเป็นสามมุมสำหรับรองรับ',
		isLoanWord: false
	},
	{
		correct: 'สายสิญจน์',
		incorrect: ['สายสิญจ์'],
		explanation: '',
		isLoanWord: false
	},
	{
		correct: 'สารประโยชน์',
		incorrect: ['สาระประโยชน์'],
		explanation: 'คำสมาส',
		isLoanWord: false
	},
	{
		correct: 'สารภี',
		incorrect: ['สาระพี', 'สารพี'],
		explanation: 'ชื่อไม้ต้นชนิดหนึ่ง ดอกสีขาวกลิ่นหอม, มิได้หมายถึง เครื่องครัว',
		isLoanWord: false
	},
	{
		correct: 'สาระสำคัญ',
		incorrect: ['สารสำคัญ'],
		explanation: 'มิใช่คำสมาส',
		isLoanWord: false
	},
	{
		correct: 'สารัตถประโยชน์',
		incorrect: ['สารัตถะประโยชน์'],
		explanation: 'คำสมาส',
		isLoanWord: false
	},
	{
		correct: 'สารัตถะสำคัญ',
		incorrect: ['สารัตถสำคัญ'],
		explanation: 'มิใช่คำสมาส',
		isLoanWord: false
	},
	{
		correct: 'สำอาง',
		incorrect: ['สำอางค์'],
		explanation: 'เครื่องสำอาง',
		isLoanWord: false
	},
	{
		correct: 'สิงโต',
		incorrect: ['สิงห์โต'],
		explanation: 'หรือใช้เพียงคำว่า สิงห์',
		isLoanWord: false
	},
	{
		correct: 'สิทธิ์',
		incorrect: ['สิทธ์'],
		explanation: '',
		isLoanWord: false
	},
	{
		correct: 'สีสวาด',
		incorrect: ['สีสวาท', 'สีสวาส'],
		explanation: 'แมวสีสวาด',
		isLoanWord: false
	},
	{
		correct: 'สีสัน',
		incorrect: ['สีสรร', 'สีสรรค์'],
		explanation: '',
		isLoanWord: false
	},
	{
		correct: 'สุกียากี้',
		incorrect: ['สุกี้ยากี้'],
		explanation: 'สามารถเรียกสั้น ๆ ว่า สุกี้',
		isLoanWord: true
	},
	{
		correct: 'สุคติ',
		incorrect: ['สุขคติ'],
		explanation: '',
		isLoanWord: false
	},
	{
		correct: 'สุญญากาศ',
		incorrect: ['สูญญากาศ'],
		explanation: 'ใช้สระ "อุ"',
		isLoanWord: false
	},
	{
		correct: 'สูจิบัตร',
		incorrect: ['สูติบัตร'],
		explanation: 'ใบแจ้งกำหนดการ',
		isLoanWord: false
	},
	{
		correct: 'สูติบัตร',
		incorrect: ['สูจิบัตร'],
		explanation: 'เอกสารหลักฐานการเกิด',
		isLoanWord: false
	},
	{
		correct: 'เสบียง',
		incorrect: ['สะเบียง', 'สเบียง'],
		explanation: '',
		isLoanWord: false
	},
	{
		correct: 'เสพ',
		incorrect: ['เสพย์'],
		explanation:
			'ปัจจุบันพจนานุกรมให้สะกดแบบเดียวเท่านั้น เช่น เสพสุรา เสพยา เสพเมถุน เสพสม เสพติด (สารเสพติด สิ่งเสพติด ยาเสพติด)',
		isLoanWord: false
	},
	{
		correct: 'เสิร์ฟ',
		incorrect: ['เสริฟ', 'เสริฟ์'],
		explanation: 'มาจาก serve ไม่ใช่อักษรควบกล้ำ',
		isLoanWord: true
	},
	{
		correct: 'เสื้อกาวน์',
		incorrect: ['เสื้อกาว', 'เสื้อกาวด์'],
		explanation: 'มาจาก gown',
		isLoanWord: true
	},
	{
		correct: 'เสื้อเชิ้ต',
		incorrect: ['เสื้อเชิ๊ต'],
		explanation: '',
		isLoanWord: true
	},
	{
		correct: 'โสฬส',
		incorrect: ['โสรส'],
		explanation: 'อ่านว่า "โส-ลด"',
		isLoanWord: false
	},
	{
		correct: 'ไส้',
		incorrect: ['ใส้'],
		explanation: '',
		isLoanWord: false
	},
	{
		correct: 'หกคะเมน',
		incorrect: ['หกคเมน', 'หกคะเมร'],
		explanation: '',
		isLoanWord: false
	},
	{
		correct: 'หงส์',
		incorrect: ['หงษ์'],
		explanation: '',
		isLoanWord: false
	},
	{
		correct: 'หน็อยแน่',
		incorrect: ['หนอยแน่'],
		explanation: '',
		isLoanWord: false
	},
	{
		correct: 'หนาแน่น',
		incorrect: ['แน่นหนา'],
		explanation:
			'- "หนาแน่น" ว่า คับคั่ง, แออัด, เช่น กรุงเทพฯ มีประชากรหนาแน่นมาก.- "แน่นหนา" ว่า มั่นคง เช่น ใส่กุญแจแน่นหนา มีหลักฐานมัดตัวแน่นหนา, แข็งแรง เช่น ประตูหน้าต่างแน่นหนา, บางทีก็ใช้เข้าคู่กับ ปึกแผ่น เป็น เป็นปึกแผ่นแน่นหนา.',
		isLoanWord: false
	},
	{
		correct: 'หน้าปัดนาฬิกา',
		incorrect: ['หน้าปัทม์นาฬิกา'],
		explanation: '',
		isLoanWord: false
	},
	{
		correct: 'หมาใน',
		incorrect: ['หมาไน'],
		explanation: '',
		isLoanWord: false
	},
	{
		correct: 'หมามุ่ย',
		incorrect: ['หมาหมุ้ย'],
		explanation: '',
		isLoanWord: false
	},
	{
		correct: 'หมูหย็อง',
		incorrect: ['หมูหยอง'],
		explanation: '',
		isLoanWord: false
	},
	{
		correct: 'หยากไย่',
		incorrect: ['หยากใย่'],
		explanation: '',
		isLoanWord: false
	},
	{
		correct: 'หย่าร้าง',
		incorrect: ['อย่าร้าง'],
		explanation: '',
		isLoanWord: false
	},
	{
		correct: 'หยิบหย่ง',
		incorrect: ['หยิบย่ง', 'หยิบโย่ง'],
		explanation: '',
		isLoanWord: false
	},
	{
		correct: 'ห่วงใย',
		incorrect: ['ห่วงไย'],
		explanation: 'คำที่ใช้ไม้ม้วน',
		isLoanWord: false
	},
	{
		correct: 'หัวมังกุท้ายมังกร',
		incorrect: ['หัวมงกุฎท้ายมังกร'],
		explanation: '(สำนวน) ไม่เข้ากัน ไม่กลมกลืนกัน (มังกุคือเรือที่มีกระดูกงูใหญ่)',
		isLoanWord: false
	},
	{
		correct: 'หัวหน่าว',
		incorrect: ['หัวเหน่า'],
		explanation: '',
		isLoanWord: false
	},
	{
		correct: 'เหม็นสาบ',
		incorrect: ['เหม็นสาป'],
		explanation: '',
		isLoanWord: false
	},
	{
		correct: 'เหล็กใน',
		incorrect: ['เหล็กไน'],
		explanation: 'ให้จำว่า เหล็กอยู่ข้างใน',
		isLoanWord: false
	},
	{
		correct: 'เหิน',
		incorrect: ['เหิร'],
		explanation: '',
		isLoanWord: false
	},
	{
		correct: 'แหลกลาญ',
		incorrect: ['แหลกราญ', 'แหลกราน'],
		explanation: '',
		isLoanWord: false
	},
	{
		correct: 'โหยหวน',
		incorrect: ['โหยหวล'],
		explanation: '',
		isLoanWord: false
	},
	{
		correct: 'โหระพา',
		incorrect: ['โหรพา', 'โหระภา'],
		explanation: '',
		isLoanWord: false
	},
	{
		correct: 'ใหลตาย',
		incorrect: ['ไหลตาย'],
		explanation: 'ใหล หมายถึงหลับใหล (ดู ราชบัณฑิตยสถาน)',
		isLoanWord: false
	},
	{
		correct: 'ไหม',
		incorrect: ['มั๊ย', 'ไม๊'],
		explanation: 'อักษรต่ำเติมไม้ตรีไม่ได้ อาจอนุโลมใช้ มั้ย ตามเสียงพูด แผลงมาจาก "หรือไม่"',
		isLoanWord: false
	},
	{
		correct: 'ไหหลำ',
		incorrect: ['ใหหลำ'],
		explanation: 'ทับศัพท์จากภาษาจีน',
		isLoanWord: false
	},
	{
		correct: 'องคชาต',
		incorrect: ['องคชาติ'],
		explanation: '',
		isLoanWord: false
	},
	{
		correct: 'องคุลิมาล',
		incorrect: ['องคุลีมาร', 'องคุลีมาล'],
		explanation: 'วิสามานยนามเป็นชื่อของพระเถระในพุทธกาล มีความหมายว่า พวงนิ้ว (มาลแปลว่าพวง)',
		isLoanWord: false
	},
	{
		correct: 'อธิษฐาน',
		incorrect: ['อธิฐาน'],
		explanation: 'สะกด "อธิฏฐาน" ได้',
		isLoanWord: false
	},
	{
		correct: 'อนาถ',
		incorrect: ['อนาจ'],
		explanation: '',
		isLoanWord: false
	},
	{
		correct: 'อนาทร',
		incorrect: ['อนาธร'],
		explanation: '',
		isLoanWord: false
	},
	{
		correct: 'อนุกาชาด',
		incorrect: ['อนุกาชาติ'],
		explanation: '',
		isLoanWord: false
	},
	{
		correct: 'อนุญาต',
		incorrect: ['อนุญาติ'],
		explanation: 'ญาติ เขียนมีสระ อิ',
		isLoanWord: false
	},
	{
		correct: 'อนุมัติ',
		incorrect: ['อนุมัต'],
		explanation: '',
		isLoanWord: false
	},
	{
		correct: 'อนุสาวรีย์',
		incorrect: ['อนุเสาวรีย์', 'อณุสาวรีย์'],
		explanation: '',
		isLoanWord: false
	},
	{
		correct: 'อเนก',
		incorrect: ['เอนก'],
		explanation:
			'มาจาก อน+เอก ตัวอย่างเช่น อเนกประสงค์ อเนกประการ อเนกอนันต์ เว้นแต่วิสามานยนามเช่น เอนก เหล่าธรรมทัศน์ เอนก นาวิกมูล',
		isLoanWord: false
	},
	{
		correct: 'อเนจอนาถ',
		incorrect: ['อเนถอนาถ'],
		explanation: '',
		isLoanWord: false
	},
	{
		correct: 'อภิรมย์',
		incorrect: ['อภิรมณ์'],
		explanation: '',
		isLoanWord: false
	},
	{
		correct: 'อภิเษก',
		incorrect: ['อภิเสก'],
		explanation: '',
		isLoanWord: false
	},
	{
		correct: 'อมต, อมตะ',
		incorrect: ['อัมตะ', 'อำมตะ'],
		explanation: '',
		isLoanWord: false
	},
	{
		correct: 'อมรินทร์',
		incorrect: ['อัมรินทร์'],
		explanation: 'ยกเว้นชื่อเฉพาะ "อัมรินทร์"',
		isLoanWord: false
	},
	{
		correct: 'อมฤต',
		incorrect: ['อัมฤต'],
		explanation: 'สะกด "อำมฤต" ได้',
		isLoanWord: false
	},
	{
		correct: 'อริยเมตไตรย',
		incorrect: ['อริยเมตตรัย', 'อริยเมตไตร'],
		explanation: '',
		isLoanWord: false
	},
	{
		correct: 'อริยสัจ',
		incorrect: ['อริยสัจจ์'],
		explanation: '',
		isLoanWord: false
	},
	{
		correct: 'อลักเอลื่อ',
		incorrect: ['อะหลักอะเหลื่อ'],
		explanation: '',
		isLoanWord: false
	},
	{
		correct: 'อลังการ',
		incorrect: ['อลังการ์'],
		explanation: 'อ่านว่า อะ-ลัง-กาน',
		isLoanWord: false
	},
	{
		correct: 'อวสาน',
		incorrect: ['อวสาณ', 'อวสานต์'],
		explanation: '',
		isLoanWord: false
	},
	{
		correct: 'อสงไขย',
		incorrect: ['อสงขัย'],
		explanation: '',
		isLoanWord: false
	},
	{
		correct: 'อหังการ์',
		incorrect: ['อหังการ'],
		explanation: 'อ่านว่า อะ-หัง-กา',
		isLoanWord: false
	},
	{
		correct: 'อหิวาตกโรค',
		incorrect: ['อะหิวาตกโรค'],
		explanation: '',
		isLoanWord: false
	},
	{
		correct: 'ออฟฟิศ',
		incorrect: ['อ็อฟ-', '-ฟิซ', '-ฟิส', '-ฟิต'],
		explanation: 'หรือใช้คำว่า สำนักงาน',
		isLoanWord: true
	},
	{
		correct: 'อะลุ่มอล่วย',
		incorrect: ['อะลุ่มอะล่วย'],
		explanation: 'สะกด "อะลุ้มอล่วย" ได้',
		isLoanWord: false
	},
	{
		correct: 'อะฟลาทอกซิน',
		incorrect: ['อัลฟาทอกซิน'],
		explanation: 'ทับศัพท์จาก aflatoxin',
		isLoanWord: true
	},
	{
		correct: 'อะไหล่',
		incorrect: ['อะหลั่ย'],
		explanation: '',
		isLoanWord: false
	},
	{
		correct: 'อักขรวิธี',
		incorrect: ['อักขระวิธี'],
		explanation: 'สมาสแล้วตัดสระอะ',
		isLoanWord: false
	},
	{
		correct: 'อักษร',
		incorrect: ['อักศร', 'อักสร'],
		explanation: '',
		isLoanWord: false
	},
	{
		correct: 'อัญชัน',
		incorrect: ['อัญชัญ'],
		explanation: '',
		isLoanWord: false
	},
	{
		correct: 'อัฒจันทร์',
		incorrect: ['อัธจันทร์'],
		explanation: '',
		isLoanWord: false
	},
	{
		correct: 'อัตคัด',
		incorrect: ['อัตคัต'],
		explanation: '',
		isLoanWord: false
	},
	{
		correct: 'อัตนัย',
		incorrect: ['อัตตะนัย'],
		explanation:
			'"อัตนัย" ตรงกับภาษาอังกฤษว่า "subjective" บางทีใช้ "อัตวิสัย" หรือ "จิตวิสัย" หมายความว่า "ที่มีอยู่ในจิต, ที่เกี่ยวกับจิต; ที่จิตคิดขึ้นเองโดยไม่อาศัยวัตถุภายนอก"',
		isLoanWord: true
	},
	{
		correct: 'อัธยาศัย',
		incorrect: ['อัทยาศัย', 'อัธยาษัย'],
		explanation: '',
		isLoanWord: false
	},
	{
		correct: 'อัปเดต',
		incorrect: ['อัพเดท', 'อัปเดท', 'อัพเดต'],
		explanation: 'ทับศัพท์มาจาก update',
		isLoanWord: true
	},
	{
		correct: 'อัปโหลด',
		incorrect: ['อัพโหลด'],
		explanation: 'ทับศัพท์มาจาก upload',
		isLoanWord: true
	},
	{
		correct: 'อัมพาต',
		incorrect: ['อัมพาส'],
		explanation: '',
		isLoanWord: false
	},
	{
		correct: 'อากาศ',
		incorrect: ['อากาส'],
		explanation: '',
		isLoanWord: false
	},
	{
		correct: 'อาฆาตมาดร้าย',
		incorrect: ['อาฆาตมาตร้าย'],
		explanation: '',
		isLoanWord: false
	},
	{
		correct: 'อาเจียน',
		incorrect: ['อาเจียร'],
		explanation: '',
		isLoanWord: false
	},
	{
		correct: 'อานิสงส์',
		incorrect: ['อานิสงฆ์'],
		explanation: '',
		isLoanWord: false
	},
	{
		correct: 'อาเพศ',
		incorrect: ['อาเพส', 'อาเภส'],
		explanation: '',
		isLoanWord: false
	},
	{
		correct: 'อารมณ์',
		incorrect: ['อารมย์'],
		explanation: '',
		isLoanWord: false
	},
	{
		correct: 'อาวรณ์',
		incorrect: ['อาวร'],
		explanation: '',
		isLoanWord: false
	},
	{
		correct: 'อาสน์สงฆ์',
		incorrect: ['อาสสงฆ์'],
		explanation: '',
		isLoanWord: false
	},
	{
		correct: 'อำนาจบาตรใหญ่',
		incorrect: ['อำนาจบาทใหญ่'],
		explanation: '',
		isLoanWord: false
	},
	{
		correct: 'อำมหิต',
		incorrect: ['อัมหิต'],
		explanation: '',
		isLoanWord: false
	},
	{
		correct: 'อินทรธนู',
		incorrect: ['อินธนู', 'อินทร์ธนู'],
		explanation: '',
		isLoanWord: false
	},
	{
		correct: 'นกอินทรี',
		incorrect: ['นกอินทรีย์'],
		explanation: '',
		isLoanWord: false
	},
	{
		correct: 'อินทรียวัตถุ',
		incorrect: ['อินทรีวัตถุ', 'อินทรีย์วัตถุ'],
		explanation: '',
		isLoanWord: false
	},
	{
		correct: 'อินเทอร์เน็ต',
		incorrect: ['อินเตอร์เน็ต'],
		explanation: 'ทับศัพท์จาก internet',
		isLoanWord: true
	},
	{
		correct: 'อินฟราเรด',
		incorrect: ['อินฟาเรด', 'อินฟาร์เรด'],
		explanation: 'ทับศัพท์จาก infrared',
		isLoanWord: true
	},
	{
		correct: 'อิริยาบถ',
		incorrect: ['อิริยาบท'],
		explanation: '',
		isLoanWord: false
	},
	{
		correct: 'อิสรภาพ',
		incorrect: ['อิสระภาพ'],
		explanation: 'คำสมาส',
		isLoanWord: false
	},
	{
		correct: 'อิสรเสรี',
		incorrect: ['อิสระเสรี'],
		explanation: 'คำสมาส',
		isLoanWord: false
	},
	{
		correct: 'อีสาน',
		incorrect: ['อิสาน', '-สาณ'],
		explanation: '',
		isLoanWord: false
	},
	{
		correct: 'อุกกาบาต',
		incorrect: ['อุกาบาต'],
		explanation: '',
		isLoanWord: false
	},
	{
		correct: 'อุกฤษฏ์',
		incorrect: ['อุกฤติ'],
		explanation: '',
		isLoanWord: false
	},
	{
		correct: 'อุดมการณ์',
		incorrect: ['อุดมการ'],
		explanation: '',
		isLoanWord: false
	},
	{
		correct: 'อุทธรณ์',
		incorrect: ['อุธรณ์'],
		explanation: '',
		isLoanWord: false
	},
	{
		correct: 'อุทาหรณ์',
		incorrect: ['อุธาหรณ์', 'อุทาหร'],
		explanation: '',
		isLoanWord: false
	},
	{
		correct: 'อุบาทว์',
		incorrect: ['อุบาท'],
		explanation: '',
		isLoanWord: false
	},
	{
		correct: 'อุปการคุณ',
		incorrect: ['อุปการะคุณ'],
		explanation: 'คำสมาส',
		isLoanWord: false
	},
	{
		correct: 'อุปถัมภ์',
		incorrect: ['อุปถัมธ์', 'อุปถัมน์'],
		explanation: '',
		isLoanWord: false
	},
	{
		correct: 'อุปโลกน์',
		incorrect: ['อุปโลก'],
		explanation: '',
		isLoanWord: false
	},
	{
		correct: 'อุปัชฌาย์',
		incorrect: ['อุปัชฌา', 'อุปัชชา'],
		explanation: '',
		isLoanWord: false
	},
	{
		correct: 'อุโมงค์',
		incorrect: ['อุโมง'],
		explanation: '',
		isLoanWord: false
	},
	{
		correct: 'เอกเขนก',
		incorrect: ['เอกขเนก'],
		explanation: '',
		isLoanWord: false
	},
	{
		correct: 'เอกฉันท์',
		incorrect: ['เอกฉัน', 'เอกะฉันท์'],
		explanation: '',
		isLoanWord: false
	},
	{
		correct: 'เอ็นดอร์ฟิน',
		incorrect: ['เอ็นโดรฟิน'],
		explanation: 'ทับศัพท์จาก endorphine',
		isLoanWord: true
	},
	{
		correct: 'โอกาส',
		incorrect: ['โอกาศ'],
		explanation: '',
		isLoanWord: false
	},
	{
		correct: 'ไอศกรีม',
		incorrect: ['ไอศครีม', 'ไอติม'],
		explanation: '',
		isLoanWord: true
	},
	{
		correct: 'ฮ่อยจ๊อ',
		incorrect: ['หอยจ๊อ', 'ห้อยจ๊อ', 'ฮ่อยจ้อ'],
		explanation: '',
		isLoanWord: true
	},
	{
		correct: 'เฮโลสาระพา',
		incorrect: ['เฮโลโหระพา'],
		explanation: 'สะกด "เฮละโลสาระพา" ได้',
		isLoanWord: false
	},
	{
		correct: 'เฮ้ย',
		incorrect: ['เห้ย', 'เฮ๊ย'],
		explanation: '',
		isLoanWord: false
	}
];
