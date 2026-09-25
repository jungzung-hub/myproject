"use client";

import { useState } from "react";
import { supabase } from "../lib/supabaseClient";

// 화면에 보이는 문의 유형 목록 (필요하면 문구만 자유롭게 바꿔도 됩니다)
const CATEGORY_OPTIONS = ["일반 문의", "예약 문의", "제품/서비스 문의", "기타"];

export default function InquiryPage() {
  // 폼 입력값 상태 (키 이름을 DB 컬럼명과 동일하게 맞춰서, 저장할 때 그대로 보낼 수 있게 함)
  const [formData, setFormData] = useState({
    name: "",
    contact: "",
    category: CATEGORY_OPTIONS[0],
    message: "",
  });

  // idle | submitting | success | error
  const [status, setStatus] = useState("idle");
  const [errorMessage, setErrorMessage] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const name = formData.name.trim();
    const contact = formData.contact.trim();
    const message = formData.message.trim();

    if (!name || !contact || !message) {
      setStatus("error");
      setErrorMessage("이름, 연락처, 문의 내용을 모두 입력해 주세요.");
      return;
    }

    setStatus("submitting");
    setErrorMessage("");

    // 폼 값 -> DB 컬럼명(name, contact, category, message)으로 매핑해서 저장
    const { error } = await supabase.from("inquiries").insert([
      {
        name,
        contact,
        category: formData.category,
        message,
      },
    ]);

    if (error) {
      console.error("문의 저장 실패:", error);
      setStatus("error");
      setErrorMessage(
        "문의 접수 중 문제가 발생했어요. 잠시 후 다시 시도해 주시거나, 다른 방법으로 연락해 주세요."
      );
      return;
    }

    // 저장에 성공했을 때만 완료 화면 표시
    setStatus("success");
  };

  if (status === "success") {
    return (
      <main style={styles.container}>
        <div style={styles.card}>
          <h1 style={styles.title}>문의가 접수되었습니다 ✅</h1>
          <p style={styles.subtitle}>빠른 시일 내에 답변드리겠습니다. 감사합니다.</p>
        </div>
      </main>
    );
  }

  return (
    <main style={styles.container}>
      <div style={styles.card}>
        <h1 style={styles.title}>문의하기</h1>
        <form onSubmit={handleSubmit} style={styles.form}>
          <label style={styles.label}>
            이름
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              style={styles.input}
              required
            />
          </label>

          <label style={styles.label}>
            연락처 (전화번호 또는 이메일)
            <input
              type="text"
              name="contact"
              value={formData.contact}
              onChange={handleChange}
              style={styles.input}
              required
            />
          </label>

          <label style={styles.label}>
            문의 유형
            <select
              name="category"
              value={formData.category}
              onChange={handleChange}
              style={styles.input}
            >
              {CATEGORY_OPTIONS.map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </select>
          </label>

          <label style={styles.label}>
            문의 내용
            <textarea
              name="message"
              value={formData.message}
              onChange={handleChange}
              style={{ ...styles.input, height: "120px", resize: "vertical" }}
              required
            />
          </label>

          {status === "error" && <p style={styles.errorText}>{errorMessage}</p>}

          <button
            type="submit"
            style={styles.button}
            disabled={status === "submitting"}
          >
            {status === "submitting" ? "접수 중..." : "문의 접수하기"}
          </button>
        </form>
      </div>
    </main>
  );
}

const styles = {
  container: {
    minHeight: "100vh",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    padding: "24px",
  },
  card: {
    width: "100%",
    maxWidth: "440px",
    background: "#fff",
    borderRadius: "16px",
    padding: "32px",
    boxShadow: "0 2px 12px rgba(0,0,0,0.08)",
  },
  title: {
    fontSize: "22px",
    fontWeight: 700,
    marginBottom: "8px",
  },
  subtitle: {
    fontSize: "15px",
    color: "#555",
  },
  form: {
    display: "flex",
    flexDirection: "column",
    gap: "16px",
    marginTop: "20px",
  },
  label: {
    display: "flex",
    flexDirection: "column",
    gap: "6px",
    fontSize: "14px",
    fontWeight: 600,
    color: "#333",
  },
  input: {
    fontSize: "15px",
    padding: "10px 12px",
    borderRadius: "8px",
    border: "1px solid #ddd",
    fontFamily: "inherit",
  },
  errorText: {
    color: "#d33",
    fontSize: "14px",
    margin: 0,
  },
  button: {
    marginTop: "8px",
    padding: "12px",
    borderRadius: "8px",
    border: "none",
    background: "#111",
    color: "#fff",
    fontSize: "15px",
    fontWeight: 600,
    cursor: "pointer",
  },
};
