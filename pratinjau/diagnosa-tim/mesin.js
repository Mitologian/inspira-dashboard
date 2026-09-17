/* Mesin Diagnosa Tim mandiri — Mitologi Inspira
 *
 * Isi: daftar pernyataan, perhitungan skor lima dimensi, penentuan pita skor,
 * dan pemilihan dua temuan yang paling layak ditulis di laporan.
 *
 * Berkas ini sengaja bebas dari tampilan supaya bisa diuji tanpa peramban
 * (uji_mesin.js) dan dipakai ulang di halaman mana pun.
 * Bahasa naskah: Indonesia baku, tanpa menyapa pembaca dengan "Anda".
 */

var DIMENSI = [
  { kunci: "tujuan", nama: "Kejelasan tujuan dan prioritas" },
  { kunci: "peran", nama: "Kejelasan peran dan pengambilan keputusan" },
  { kunci: "komunikasi", nama: "Komunikasi dan umpan balik" },
  { kunci: "kepercayaan", nama: "Kepercayaan dan cara menangani konflik" },
  { kunci: "eksekusi", nama: "Ritme eksekusi" }
];

/* balik: true berarti pernyataan bernada negatif, jadi skornya dibalik (6 - jawaban). */
var PERNYATAAN = [
  { d: "tujuan", teks: "Tim kami punya satu sampai tiga prioritas yang jelas untuk kuartal ini.", balik: false },
  { d: "peran", teks: "Setiap orang tahu keputusan apa yang boleh ia ambil sendiri tanpa menunggu atasan.", balik: false },
  { d: "komunikasi", teks: "Umpan balik tentang hasil kerja disampaikan langsung kepada orangnya, bukan lewat orang lain.", balik: false },
  { d: "kepercayaan", teks: "Ketika ada perbedaan pendapat, tim menyelesaikannya sampai tuntas, bukan menghindarinya.", balik: false },
  { d: "eksekusi", teks: "Rapat rutin kami menghasilkan keputusan dan daftar tindak lanjut yang jelas siapa pemiliknya.", balik: false },
  { d: "tujuan", teks: "Prioritas sering berpindah tanpa pemberitahuan, dan tim baru tahu setelah pekerjaan berjalan.", balik: true },
  { d: "peran", teks: "Ketika ada pekerjaan yang tertahan, jelas siapa yang harus menyelesaikannya.", balik: false },
  { d: "komunikasi", teks: "Anggota tim berani menyampaikan masalah tanpa merasa akan disalahkan.", balik: false },
  { d: "kepercayaan", teks: "Anggota tim saling menutup celah kekurangan satu sama lain, bukan saling menyalahkan.", balik: false },
  { d: "eksekusi", teks: "Pekerjaan penting sering selesai terlambat karena tidak ada yang memeriksa kemajuannya.", balik: true }
];

var PITA = [
  { min: 80, nama: "Kokoh", warna: "#1F9D6B",
    arti: "Fondasi tim sudah bekerja. Yang dibutuhkan bukan perbaikan besar, melainkan menjaga ritme dan menjaganya tetap terukur." },
  { min: 65, nama: "Sehat dengan catatan", warna: "#4E8CD6",
    arti: "Sebagian besar berjalan baik. Satu atau dua titik masih menahan laju kerja tim." },
  { min: 50, nama: "Perlu perhatian", warna: "#D99A2B",
    arti: "Ada bagian yang sudah mulai menghambat pekerjaan. Semakin lama dibiarkan, semakin sering muncul kembali dalam bentuk yang berbeda." },
  { min: 0, nama: "Rentan", warna: "#C75450",
    arti: "Kerja tim banyak ditentukan oleh keadaan, bukan oleh kesepakatan. Ini titik di mana intervensi paling cepat berpengaruh." }
];

/* Kalimat temuan per dimensi. Dipilih berdasarkan dimensi terlemah, lalu diberi
 * satu butir paling lemah dari dimensi itu supaya temuannya konkret, bukan umum. */
var TEMUAN = {
  tujuan: {
    pesan: "Prioritas tim belum berfungsi sebagai penyaring keputusan. Waktu cenderung habis untuk hal yang datang paling akhir, bukan yang paling penting.",
    tindakan: "Tetapkan paling banyak tiga prioritas kuartal ini, tuliskan di satu tempat yang dilihat semua orang, dan setiap perubahan diberitahukan beserta alasannya."
  },
  peran: {
    pesan: "Batas keputusan belum jelas, sehingga ada pekerjaan yang berhenti menunggu satu orang, sementara tanggung jawab terasa kabur saat ada yang tertahan.",
    tindakan: "Buat daftar keputusan yang boleh diambil tiap peran tanpa persetujuan, lalu sepakati siapa pengganti ketika pemiliknya tidak tersedia."
  },
  komunikasi: {
    pesan: "Umpan balik dan penyampaian masalah belum aman dilakukan. Akibatnya masalah kecil terlihat terlambat, dan sering muncul sebagai keluhan, bukan percakapan.",
    tindakan: "Biasakan umpan balik singkat dan berjadwal, langsung kepada orangnya, dengan urutan: apa yang bekerja, apa yang menghambat, lalu kesepakatan berikutnya."
  },
  kepercayaan: {
    pesan: "Perbedaan pendapat cenderung dihindari atau diselesaikan di luar forum, sehingga keputusan terlihat sepakat padahal belum tentu.",
    tindakan: "Sepakati aturan satu percakapan: setiap perbedaan dibahas sampai ada keputusan, dan keputusan itu dituliskan lengkap dengan alasan penolakannya."
  },
  eksekusi: {
    pesan: "Ritme kerja belum menjaga kemajuan. Pekerjaan bergantung pada ingatan dan dorongan sesaat, sehingga yang terlambat biasanya ketahuan di akhir.",
    tindakan: "Jalankan pemeriksaan kemajuan singkat setiap pekan dengan tiga pertanyaan tetap, dan tandai satu penghambat yang harus selesai pekan itu."
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
    return { kunci: d.kunci, nama: d.nama, skor: skor(rata),
             butir: butir, palingLemah: palingLemah };
  });

  var total = Math.round(perDimensi.reduce(function (a, d) { return a + d.skor; }, 0) / perDimensi.length);
  var bersihRata = bersih.reduce(function (a, b) { return a + b; }, 0) / bersih.length;
  var hampirSama = bersih.every(function (n) { return Math.abs(n - bersihRata) < 0.5; });

  return {
    total: total,
    pita: pitaUntuk(total),
    dimensi: perDimensi,
    seragam: hampirSama,
    temuan: pilihTemuan(perDimensi)
  };
}

function pitaUntuk(total) {
  for (var i = 0; i < PITA.length; i++) {
    if (total >= PITA[i].min) return PITA[i];
  }
  return PITA[PITA.length - 1];
}

/* Dua dimensi terlemah, dan hanya yang benar-benar menghambat (di bawah 65). */
function pilihTemuan(perDimensi) {
  var urut = perDimensi.slice().sort(function (a, b) { return a.skor - b.skor; });
  return urut.filter(function (d) { return d.skor < 65; }).slice(0, 2).map(function (d) {
    return {
      kunci: d.kunci,
      nama: d.nama,
      skor: d.skor,
      pesan: TEMUAN[d.kunci].pesan,
      tindakan: TEMUAN[d.kunci].tindakan,
      butir: d.palingLemah.teks,
      nilaiButir: d.palingLemah.mentah
    };
  });
}

function kalimatTemuan(t) {
  return "Butir yang paling lemah di bagian ini: \u201c" + t.butir + "\u201d, dinilai " +
         t.nilaiButir + " dari 5.";
}

/* Ringkasan untuk WhatsApp, dipakai tombol ajakan di akhir laporan. */
function ringkasUntukWa(hasil, data) {
  var isi = DIMENSI.map(function (d) {
    var cari = hasil.dimensi.filter(function (x) { return x.kunci === d.kunci; })[0];
    return d.nama.split(" dan ")[0] + " " + cari.skor;
  }).join(", ");
  return "Halo, tim " + (data.perusahaan || "kami") + " (" + (data.jumlah || "-") + " orang) sudah mengisi " +
         "Diagnosa Tim mandiri. Skor total " + hasil.total + " dari 100 (" + isi + "). " +
         "Kami ingin menjadwalkan sesi 45 menit untuk membahas hasilnya.";
}

/* Dipakai lewat peramban: seluruh isi mesin dipasang di window.MESIN. */
if (typeof window !== "undefined") {
  window.MESIN = { DIMENSI: DIMENSI, PERNYATAAN: PERNYATAAN, PITA: PITA, TEMUAN: TEMUAN,
                   hitung: hitung, pitaUntuk: pitaUntuk, pilihTemuan: pilihTemuan,
                   kalimatTemuan: kalimatTemuan, ringkasUntukWa: ringkasUntukWa, skor: skor };
}

if (typeof module !== "undefined" && module.exports) {
  module.exports = { DIMENSI: DIMENSI, PERNYATAAN: PERNYATAAN, PITA: PITA, TEMUAN: TEMUAN,
                     hitung: hitung, pitaUntuk: pitaUntuk, pilihTemuan: pilihTemuan,
                     kalimatTemuan: kalimatTemuan, ringkasUntukWa: ringkasUntukWa, skor: skor };
}
