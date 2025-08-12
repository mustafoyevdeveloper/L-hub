import Seo from '@/components/Seo'

export default function RulesPage() {
  return (
    <main className="container mx-auto space-y-8 p-4 md:p-6">
      <Seo title="Qoidalar va ishtirok tartibi | FairRNG" description="O‘yin qoidalari, ishtirok tartibi, to‘lov va yutuqlar haqida" />
      <h1 className="text-3xl font-bold tracking-tight">O‘yin qoidalari va ishtirok tartibi</h1>

      <section className="space-y-2">
        <h2 className="text-2xl font-semibold">Ishtirok etish tartibi</h2>
        <p>Dastlab ishtirokchi veb-sayt orqali ro‘yxatdan o‘tadi (ismi, e-pochta, yashash davlati, to‘lov manbai kiritiladi). So‘ngra entry fee to‘lanadi (UZS, USD yoki RUB-da), to‘lov amalga oshirilganidan so‘ng ishtirokchi raqamli chiptaga ega bo‘ladi va u chiptani hohlasa keyingi raundlarda ishlatishi mumkin. Har bir raundga maksimal 5,000 kishi ishtirok etishi mumkin; raund tegishli vaqtda yoki maksimal miqdordagi ishtirokchilar to‘lganda yakunlanadi.</p>
      </section>

      <section className="space-y-2">
        <h2 className="text-2xl font-semibold">To‘lov tizimi</h2>
        <ul className="list-disc ml-5 space-y-1">
          <li>Bank kartasi (Visa/MasterCard) orqali to‘lov imkoniyati.</li>
          <li>UZS, USD, RUB va boshqa valyutalarini qo‘llab-quvvatlaydi.</li>
          <li>To‘lov tasdiqlangach avtomatik ravishda foydalanuvchi kabinetiga o‘tkaziladi.</li>
          <li>Tranzaksiya tarixi va holati doimiy yangilanadi.</li>
        </ul>
      </section>

      <section className="space-y-2">
        <h2 className="text-2xl font-semibold">Shaxsiy kabinet</h2>
        <ul className="list-disc ml-5 space-y-1">
          <li>Yutuq balansi real vaqtda yangilanadi va ko‘rinadi.</li>
          <li>Pul yechib olish so‘rovi bank kartasiga komissiyasiz yaratiladi.</li>
          <li>Har bir so‘rov “Kutilayotgan pul yechilishlar” bo‘limiga tushadi.</li>
          <li>O‘yinlarda ishtirok etish tarixi (raundlar ro‘yxati) mavjud.</li>
          <li>Profil sozlamalari orqali til va aloqa ma’lumotlarini yangilash.</li>
        </ul>
      </section>

      <section className="space-y-2">
        <h2 className="text-2xl font-semibold">Raund arxivi</h2>
        <ul className="list-disc ml-5 space-y-1">
          <li>Ishtirokchilar ro‘yxati ism va o‘yin raqami bilan saqlanadi.</li>
          <li>Jonli efir tugagach g‘oliblar ro‘yxati (yutuq turi, ism, raqam) chiqadi.</li>
          <li>YouTube livestream yozuvi avtomatik yuklanadi.</li>
          <li>Oldingi raund natijalarini sanaga yoki yutuq turiga qarab filtrlash.</li>
        </ul>
      </section>

      <section className="space-y-2">
        <h2 className="text-2xl font-semibold">Video arxiv</h2>
        <ul className="list-disc ml-5 space-y-1">
          <li>Barcha livestream yozuvlari yagona bo‘limda jamlanadi.</li>
          <li>Avtomobil topshirish marosimi videolari arxivga yuklanadi.</li>
          <li>G‘oliblar bilan intervyular va tasdiqlovchi kontent joylanadi.</li>
          <li>Video arxivga login talab qilinmaydi, hammaga ochiq.</li>
        </ul>
      </section>

      <section className="space-y-2">
        <h2 className="text-2xl font-semibold">Yangiliklar va qoidalar</h2>
        <p>Yangiliklar sahifasida yangi raundlar, e’lonlar va natijalar muntazam yangilanadi. Rasmiy qoidalar va ishtirok shartlari alohida sahifada joylanadi. FAQ bo‘limi tez-tez so‘raladigan savollarga javob beradi. Saytda chatbot savollarga zudlik bilan javob beradi.</p>
      </section>

      <section className="space-y-2">
        <h2 className="text-2xl font-semibold">Qo‘llab-quvvatlash va integratsiya</h2>
        <p>Telegram bot real-vaqt xabarlar — yangi raund boshlanishi, yutuq natijalari yoki to‘lov holati haqida xabarlar yuboriladi. Support ticket tizimi orqali ariza ochish, holatini kuzatish mumkin.</p>
      </section>

      <section className="space-y-2">
        <h2 className="text-2xl font-semibold">Mini-o‘yinlar va ball tizimi</h2>
        <p>Mini-o‘yinlar foydalanuvchini jalb qilish uchun qo‘shimcha o‘yinlar bo‘lib, ball yig‘ish tizimi bilan birga ishlaydi. Standart foydalanuvchi 1x, VIP foydalanuvchi 1.5x ball oladi. Ballar chipta yoki chegirmaga almashtiriladi.</p>
      </section>

      <section className="space-y-2">
        <h2 className="text-2xl font-semibold">Tariflar</h2>
        <ul className="list-disc ml-5 space-y-1">
          <li>Standart: 200 000 UZS — asosiy lotereyada qatnashish, mini-o‘yinlar uchun alohida obuna talab etiladi.</li>
          <li>VIP: 350 000 UZS — lotereya + mini-o‘yinlarga bepul kirish, ball yig‘ishda 1.5x koeffitsiyent.</li>
        </ul>
      </section>

      <section className="space-y-2">
        <h2 className="text-2xl font-semibold">Yutuqlarni aniqlash mexanizmi</h2>
        <p>G‘oliblar kompyuter algoritmi asosida — ishtirokchilardan tasodifiy tanlanadi (Lucky draw), adolat tamoyili ta’minlanadi. G‘oliblar ism-shariflari YouTube jonli efirida e’lon qilinadi.</p>
      </section>

      <section className="space-y-2">
        <h2 className="text-2xl font-semibold">Yutuqlar va yetkazib berish</h2>
        <ul className="list-disc ml-5 space-y-1">
          <li>Har bir raundda jami 90 ta mukofot (avtomobillar, naqd pullar, bepul chiptalar).</li>
          <li>Avtomobillar rasmiy shartnoma asosida topshiriladi.</li>
          <li>Naqd pullar karta yoki xalqaro o‘tkazma orqali beriladi yoki hisobga tushiriladi.</li>
          <li>Keyingi raund chiptalari profilga avtomatik yoziladi.</li>
        </ul>
      </section>
    </main>
  )
}


