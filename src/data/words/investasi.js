// Kategori 6: investasi bodong (untung pasti, robot trading, skema ponzi).
import { pola } from '../../lib/patterns.js';

export default {
  id: 'untung-pasti',
  weight: 2,
  title: 'Untung dijamin',
  why: 'Investasi resmi selalu punya risiko. Janji untung pasti adalah ciri investasi bodong. Cek izinnya di OJK 157.',
  words: [
    'untung pasti', 'pasti untung', 'dijamin untung', 'untung dijamin', 'profit pasti', 'profit harian',
    'profit dijamin', 'profit konsisten', 'profit setiap hari', 'keuntungan pasti', 'keuntungan harian',
    'keuntungan tetap', 'keuntungan dijamin', 'return pasti', 'return harian', 'return dijamin', 'imbal hasil pasti',
    'imbal hasil tetap', 'bunga tinggi pasti', 'tanpa risiko', 'bebas risiko', 'nol risiko', 'zero risk',
    'anti rugi', 'tidak mungkin rugi', 'gak mungkin rugi', 'pasti cuan', 'cuan pasti', 'passive income',
    'penghasilan pasif', 'robot trading', 'bot trading', 'trading otomatis', 'auto trading', 'sinyal vip',
    'signal vip', 'grup sinyal', 'grup sinyal trading', 'member vip', 'kelas vip trading', 'forex',
    'binary option', 'opsi biner', 'trading binary', 'aset kripto baru', 'koin baru pasti naik', 'token baru pasti naik',
    'presale token', 'airdrop', 'cloud mining', 'mining harian', 'staking harian', 'arisan online', 'arisan duit',
    'arisan menurun', 'arisan berantai', 'arisan bodong', 'skema ponzi', 'ponzi', 'piramida', 'skema piramida',
    'money game', 'investasi bodong', 'investasi ilegal', 'modal kecil untung besar', 'uang jadi berlipat',
    'berlipat ganda', 'lipat ganda', 'dua kali lipat dalam', 'tiga kali lipat dalam', 'balik modal cepat',
    'balik modal dalam seminggu', 'titip dana', 'titip modal', 'kelola dana', 'dana dikelola', 'manajer investasi pribadi',
    'trader profesional', 'mentor trading', 'copy trade', 'copy trading', 'afiliasi binary', 'afiliator binary',
    'bonus referral', 'bonus sponsor', 'downline', 'upline', 'rekrut member', 'ajak teman dapat bonus',
    'investasi emas online', 'saham gorengan', 'pump and dump', 'koin meme pasti naik', 'nft gratis', 'paket investasi',
    'paket investasi vip', 'investasi minimal', 'investasi mulai dari', 'investasi aman tanpa risiko',
    'investasi syariah pasti untung', 'deposit investasi', 'top up investasi', 'tarik profit', 'withdraw profit',
    'profit bisa ditarik', 'kontrak investasi', 'investasi berjangka pasti', 'bagi hasil pasti', 'bagi hasil tetap',
    'bagi hasil per bulan pasti', 'quantum trading', 'ai trading pasti profit', 'trading ai', 'ea trading',
    'expert advisor', 'auto pilot trading', 'investasi tanpa kerja', 'cuan tanpa kerja', 'jual beli kurs pasti untung',
    'lelang arisan', 'arisan get', 'slot arisan',
  ],
  exact: [
    'mlm', 'p2p bodong', 'roi pasti', 'roi harian', 'roi 30%', 'apr tinggi', 'wd profit', 'tf modal',
    'binomo', 'olymptrade', 'quotex', 'iq option', 'robot fx', 'fx trading', 'cuan2',
    'auto profit', 'autoprofit', 'profit 100%', 'profit 50%', 'profit 30%', 'profit 10% per hari',
  ],
  ambiguous: [
    'investasi', 'trading', 'profit', 'untung', 'keuntungan', 'saham', 'emas', 'bisnis', 'peluang usaha', 'modal',
    'dividen', 'bunga', 'kripto', 'mining', 'staking', 'koin', 'trader', 'sinyal', 'signal',
    'portofolio', 'aset', 'member', 'vip', 'join', 'gabung',
    'arisan', 'referral', 'presale', 'listing',
  ],
  patterns: [
    pola(
      String.raw`(?:untung|profit|bunga|return|roi|keuntungan|cuan|bagi\s+hasil)\s+(?:hingga\s+|sampai\s+|s\/d\s+)?\d+(?:[.,]\d+)?\s?%(?:\s+(?:per|setiap|tiap)\s+(?:hari|minggu|bulan))?`,
      String.raw`\d+(?:[.,]\d+)?\s?%\s+(?:per|setiap|tiap)\s+(?:hari|minggu)`,
    ),
  ],
};
