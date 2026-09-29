document.addEventListener("DOMContentLoaded", function () {
  const form = document.getElementById("formRegister");

  const fields = {
    username: document.getElementById("username"),
    password: document.getElementById("password"),
    nama: document.getElementById("nama"),
    tanggalLahir: document.getElementById("tanggalLahir"),
    alamat: document.getElementById("alamat"),
    noTelp: document.getElementById("noTelp")
  };

  const BORDER = "border-slate-200";
  const BORDER_ERROR = "border-rose-400";
  const RING = "focus:ring-violet-100";
  const RING_ERROR = "focus:ring-rose-100";

  function hariIniISO() {
    const d = new Date();
    const bulan = String(d.getMonth() + 1).padStart(2, "0");
    const tanggal = String(d.getDate()).padStart(2, "0");
    return d.getFullYear() + "-" + bulan + "-" + tanggal;
  }

  const rules = {
    username(value) {
      const v = value.trim();
      if (v === "") return "Username tidak boleh kosong.";
      if (v.length < 3) return "Username minimal 3 karakter.";
      return "";
    },

    password(value) {
      if (value === "") return "Password tidak boleh kosong.";
      if (value.length < 8) return "Password minimal 8 karakter.";
      return "";
    },

    nama(value) {
      if (value.trim() === "") return "Nama tidak boleh kosong.";
      return "";
    },

    tanggalLahir(value) {
      if (value === "") return "Tanggal lahir tidak boleh kosong.";
      if (value > hariIniISO()) return "Tanggal lahir tidak boleh lebih dari hari ini.";
      return "";
    },

    alamat(value) {
      if (value.trim() === "") return "Alamat tidak boleh kosong.";
      return "";
    },

    noTelp(value) {
      const v = value.trim();
      if (v === "") return "Nomor telepon tidak boleh kosong.";
      if (!v.startsWith("62")) return "Nomor telepon harus berawalan 62.";
      if (!/^62[0-9]+$/.test(v)) return "Nomor telepon hanya boleh berisi angka setelah 62.";
      if (v.length < 10) return "Nomor telepon minimal 62 + 8 digit.";
      return "";
    }
  };

  function tampilkanError(namaField, pesan) {
    const input = fields[namaField];
    const errBox = document.getElementById("err-" + namaField);

    if (pesan === "") {
      errBox.textContent = "";
      errBox.classList.add("hidden");
      input.classList.remove(BORDER_ERROR, RING_ERROR, "is-error");
      input.classList.add(BORDER, RING);
    } else {
      const baruError = errBox.classList.contains("hidden");
      errBox.textContent = pesan;
      errBox.classList.remove("hidden");
      input.classList.remove(BORDER, RING);
      input.classList.add(BORDER_ERROR, RING_ERROR);

      // Shake hanya saat field tadinya belum error, biar tidak getar berulang
      if (baruError) {
        input.classList.remove("is-error");
        void input.offsetWidth;
        input.classList.add("is-error");
      }
    }
  }

  function validasiField(namaField) {
    const pesan = rules[namaField](fields[namaField].value);
    tampilkanError(namaField, pesan);
    return pesan === "";
  }

  // Cegah tanggal lahir dipilih di masa depan lewat date picker
  fields.tanggalLahir.max = hariIniISO();

  Object.keys(fields).forEach(function (namaField) {
    const input = fields[namaField];

    input.addEventListener("blur", function () {
      validasiField(namaField);
    });

    // Validasi ulang saat memperbaiki, tapi hanya kalau field sedang error
    input.addEventListener("input", function () {
      const errBox = document.getElementById("err-" + namaField);
      if (!errBox.classList.contains("hidden")) {
        validasiField(namaField);
      }
    });
  });

  form.addEventListener("submit", function (event) {
    let valid = true;
    let fokusPertama = null;

    Object.keys(fields).forEach(function (namaField) {
      if (!validasiField(namaField)) {
        valid = false;
        if (fokusPertama === null) fokusPertama = fields[namaField];
      }
    });

    if (!valid) {
      event.preventDefault();
      if (fokusPertama) fokusPertama.focus();
    }
  });
});
