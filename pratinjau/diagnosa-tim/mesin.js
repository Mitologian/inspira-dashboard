/* Mesin Diagnosa Tim mandiri — Mitologi Inspira
 *
 * Berbasis kerangka lima lapis Organizational Alignment Map (OAM) milik Ansaka.
 * Sepuluh pernyataan, dua per lapis. Berkas ini sengaja bebas dari tampilan supaya
 * bisa diuji tanpa peramban (uji_mesin.js) dan dipakai ulang di halaman mana pun.
 *
 * Bahasa naskah: Indonesia baku, tanpa menyapa pembaca dengan "Anda".
 */

var DIMENSI = [
  { kunci: "fondasi", nama: "Fondasi strategi", inggris: "Strategic Foundation", lapis: 1, jalur: "Ansaka" },
  { kunci: "kepemimpinan", nama: "Sistem kepemimpinan", inggris: "Leadership System", lapis: 2, jalur: "Ansaka" },
  { kunci: "manajemen", nama: "Alur manajemen", inggris: "Management Cascade", lapis: 3, jalur: "Mitologi Inspira" },
  { kunci: "eksekusi", nama: "Eksekusi tim", inggris: "Team Execution", lapis: 4, jalur: "Mitologi Inspira" },
  { kunci: "individu", nama: "Pengembangan individu", inggris: "Individual Development", lapis: 5, jalur: "Mitologi Inspira" }
];

/* balik: true berarti pernyataan bernada negatif, jadi skornya dibalik (6 - jawaban).
 * Urutan disusun selang-seling antar lapis, dan dua butir negatif tidak berdekatan. */
var PERNYATAAN = [
  { d: "fondasi", teks: "Arah dan sasaran organisasi jelas bagi tim kami, dan kami tahu bagian mana yang menjadi tanggung jawab kami.", balik: false },
  { d: "manajemen", teks: "Setiap orang tahu keputusan apa yang boleh ia ambil sendiri tanpa menunggu atasan.", balik: false },
  { d: "kepemimpinan", teks: "Para pemimpin di tingkat atas menyampaikan pesan yang sama tentang prioritas, bukan berbeda-beda.", balik: false },
  { d: "eksekusi", teks: "Ketika ada perbedaan pendapat, tim menyelesaikannya sampai tuntas, bukan menghindarinya.", balik: false },
  { d: "individu", teks: "Setiap orang punya rencana pengembangan kemampuan yang dibahas, bukan sekadar administrasi.", balik: false },
  { d: "manajemen", teks: "Prioritas sering berpindah tanpa pemberitahuan, dan tim baru tahu setelah pekerjaan berjalan.", balik: true },
  { d: "individu", teks: "Kemampuan yang dibutuhkan untuk pekerjaan berikutnya sudah direncanakan, bukan dicari saat sudah dibutuhkan.", balik: false },
  { d: "eksekusi", teks: "Pekerjaan penting sering selesai terlambat karena tidak ada yang memeriksa kemajuannya.", balik: true },
  { d: "kepemimpinan", teks: "Ketika keputusan besar diambil, alasannya dijelaskan sehingga bisa dijalankan dengan yakin.", balik: false },
  { d: "fondasi", teks: "Kami tahu bagaimana pekerjaan hari ini menyambung ke sasaran tahun ini.", balik: false }
];

var PITA = [
  { min: 80, nama: "Kokoh", warna: "#1D9E75",
    arti: "Fondasi tim sudah bekerja. Yang dibutuhkan bukan perbaikan besar, melainkan menjaga ritme dan mengukurnya kembali." },
  { min: 65, nama: "Sehat dengan catatan", warna: "#2563B0",
    arti: "Sebagian besar berjalan baik. Satu atau dua titik masih menahan laju kerja tim." },
  { min: 50, nama: "Perlu perhatian", warna: "#E08A1E",
    arti: "Ada bagian yang sudah mulai menghambat pekerjaan. Semakin lama dibiarkan, semakin sering muncul kembali dalam bentuk yang berbeda." },
  { min: 0, nama: "Rentan", warna: "#C0392B",
    arti: "Kerja tim banyak ditentukan oleh keadaan, bukan oleh kesepakatan. Ini titik di mana intervensi paling cepat berpengaruh." }
];

/* Kalimat temuan per lapis. Dipilih dari lapis terlemah, lalu diberi satu butir paling
 * lemah dari lapis itu supaya temuannya konkret, bukan umum. */
var TEMUAN = {
  fondasi: {
    pesan: "Arah organisasi belum berfungsi sebagai penyaring keputusan di tingkat tim. Pekerjaan cenderung mengikuti apa yang datang paling akhir, bukan yang paling penting.",
    tindakan: "Rumuskan paling banyak tiga sasaran periode ini, terjemahkan ke ukuran yang bisa dilihat tim setiap pekan, dan nyatakan bagian mana yang menjadi tanggung jawab tim ini."
  },
  kepemimpinan: {
    pesan: "Pesan dari tingkat atas belum sampai sebagai satu suara. Tim menerima versi yang berbeda-beda, sehingga mereka menebak sendiri mana yang harus didahulukan.",
    tindakan: "Sepakati siapa yang menyampaikan prioritas dan bagaimana pesannya diseragamkan, lalu ulangi pesan yang sama sampai terasa berulang bagi pemimpin, tapi jelas bagi tim."
  },
  manajemen: {
    pesan: "Batas keputusan dan alur prioritas belum jelas, sehingga pekerjaan berhenti menunggu satu orang, dan perubahan arah datang tanpa pemberitahuan.",
    tindakan: "Buat daftar keputusan yang boleh diambil tiap peran tanpa persetujuan, tentukan pengganti saat pemiliknya tidak tersedia, dan biasakan mengumumkan setiap perubahan prioritas beserta alasannya."
  },
  eksekusi: {
    pesan: "Ritme kerja belum menjaga kemajuan, dan perbedaan pendapat cenderung dihindari atau diselesaikan di luar forum. Pekerjaan yang terlambat biasanya ketahuan di akhir.",
    tindakan: "Jalankan pemeriksaan kemajuan singkat setiap pekan dengan tiga pertanyaan tetap, dan sepakati satu aturan: setiap perbedaan dibahas sampai ada keputusan yang dicatat."
  },
  individu: {
    pesan: "Pengembangan kemampuan berjalan sebagai administrasi, bukan sebagai persiapan. Kebutuhan kemampuan baru biasanya baru dicari saat pekerjaan sudah menuntutnya.",
    tindakan: "Bahas rencana pengembangan tiap orang satu per satu setiap kuartal, dan hubungkan dengan kemampuan yang akan dibutuhkan dua kuartal ke depan, bukan yang sudah dibutuhkan hari ini."
  }
};

function balikSkor(butir, jawaban) {
  return butir.balik ? 6 - jawaban : jawaban;
}

function skor(nilai1sampai5) {
  return Math.round(((nilai1sampai5 - 1) / 4) * 100);
}

/* jawaban: larik berisi angka 1 sampai 5 sepanjang PERNYATAAN */
function hitung(jawaban) {
  if (!Array.isArray(jawaban) || jawaban.length !== PERNYATAAN.length) {
    throw new Error("jumlah jawaban harus " + PERNYATAAN.length);
  }
  var kumpulan = {};
  DIMENSI.forEach(function (d) { kumpulan[d.kunci] = []; });
  var bersih = [];
  PERNYATAAN.forEach(function (b, i) {
    var angka = Number(jawaban[i]);
    if (!(angka >= 1 && angka <= 5)) throw new Error("jawaban ke-" + (i + 1) + " tidak sah");
    var nilai = balikSkor(b, angka);
    kumpulan[b.d].push({ teks: b.teks, mentah: angka, nilai: nilai });
    bersih.push(nilai);
  });

  var perDimensi = DIMENSI.map(function (d) {
    var butir = kumpulan[d.kunci];
    var rata = butir.reduce(function (a, b) { return a + b.nilai; }, 0) / butir.length;
    var palingLemah = butir.slice().sort(function (a, b) { return a.nilai - b.nilai; })[0];
    return { kunci: d.kunci, nama: d.nama, inggris: d.inggris, lapis: d.lapis, jalur: d.jalur,
             skor: skor(rata), butir: butir, palingLemah: palingLemah };
  });

  var total = Math.round(perDimensi.reduce(function (a, d) { return a + d.skor; }, 0) / perDimensi.length);
  var bersihRata = bersih.reduce(function (a, b) { return a + b; }, 0) / bersih.length;
  var hampirSama = bersih.every(function (n) { return Math.abs(n - bersihRata) < 0.5; });
  var temuan = pilihTemuan(perDimensi);

  return {
    total: total,
    pita: pitaUntuk(total),
    dimensi: perDimensi,
    terlemah: perDimensi.slice().sort(function (a, b) { return a.skor - b.skor; })[0],
    jalur: temuan.length ? temuan[0].jalur : null,
    seragam: hampirSama,
    temuan: temuan
  };
}

function pitaUntuk(total) {
  for (var i = 0; i < PITA.length; i++) {
    if (total >= PITA[i].min) return PITA[i];
  }
  return PITA[PITA.length - 1];
}

/* Dua lapis terlemah, dan hanya yang benar-benar menghambat (di bawah 65). */
function pilihTemuan(perDimensi) {
  var urut = perDimensi.slice().sort(function (a, b) { return a.skor - b.skor; });
  return urut.filter(function (d) { return d.skor < 65; }).slice(0, 2).map(function (d) {
    return {
      kunci: d.kunci, nama: d.nama, lapis: d.lapis, jalur: d.jalur, skor: d.skor,
      pesan: TEMUAN[d.kunci].pesan,
      tindakan: TEMUAN[d.kunci].tindakan,
      butir: d.palingLemah.teks,
      nilaiButir: d.palingLemah.mentah
    };
  });
}

function kalimatTemuan(t) {
  return "Butir yang paling lemah di lapis ini: \u201c" + t.butir + "\u201d, dinilai " +
         t.nilaiButir + " dari 5.";
}

/* Kalimat arah percakapan, dipakai di rapor dan di pesan WhatsApp. */
function kalimatJalur(hasil) {
  var t = hasil.terlemah;
  if (t.jalur === "Ansaka") {
    return "Lapis terlemah ada di " + t.nama + " (lapis " + t.lapis + " dari 5), yaitu wilayah arah dan " +
           "kepemimpinan. Percakapan paling tepat dimulai dari sana, bersama Ansaka.";
  }
  return "Lapis terlemah ada di " + t.nama + " (lapis " + t.lapis + " dari 5), yaitu wilayah eksekusi dan " +
         "kapasitas tim. Percakapan paling tepat dimulai dari sana, bersama Mitologi Inspira.";
}

/* Ringkasan untuk WhatsApp, dipakai tombol ajakan di akhir laporan. */
function ringkasUntukWa(hasil, data) {
  var isi = hasil.dimensi.slice().sort(function (a, b) { return a.lapis - b.lapis; })
    .map(function (d) { return d.nama + " " + d.skor; }).join(", ");
  return "Halo, tim " + (data.perusahaan || "kami") + " (" + (data.jumlah || "-") + " orang) sudah mengisi " +
         "Diagnosa Tim mandiri berbasis lima lapis OAM. Skor total " + hasil.total + " dari 100 (" + isi + "). " +
         "Lapis terlemah: " + hasil.terlemah.nama + ". Kami ingin menjadwalkan sesi 45 menit untuk membahasnya.";
}

/* Dipakai lewat peramban: seluruh isi mesin dipasang di window.MESIN. */
if (typeof window !== "undefined") {
  window.MESIN = { DIMENSI: DIMENSI, PERNYATAAN: PERNYATAAN, PITA: PITA, TEMUAN: TEMUAN,
                   hitung: hitung, pitaUntuk: pitaUntuk, pilihTemuan: pilihTemuan,
                   kalimatTemuan: kalimatTemuan, kalimatJalur: kalimatJalur,
                   ringkasUntukWa: ringkasUntukWa, skor: skor };
}

if (typeof module !== "undefined" && module.exports) {
  module.exports = { DIMENSI: DIMENSI, PERNYATAAN: PERNYATAAN, PITA: PITA, TEMUAN: TEMUAN,
                     hitung: hitung, pitaUntuk: pitaUntuk, pilihTemuan: pilihTemuan,
                     kalimatTemuan: kalimatTemuan, kalimatJalur: kalimatJalur,
                     ringkasUntukWa: ringkasUntukWa, skor: skor };
}
