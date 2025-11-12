"use client";

import React, { useState, useRef, useEffect } from "react";
import Image from "next/image";
import styles from "./ChatBox.module.scss";

export default function ChatBox() {
  const [messages, setMessages] = useState<{ sender: string; text: string; link?: string | null }[]>([]);
  const [input, setInput] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const chatBodyRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom when messages change
  useEffect(() => {
    if (chatBodyRef.current) {
      chatBodyRef.current.scrollTop = chatBodyRef.current.scrollHeight;
    }
  }, [messages, loading]);

  // Add welcome message when chat opens for the first time
  useEffect(() => {
    if (isOpen && messages.length === 0) {
      setMessages([{ sender: "bot", text: "Xin chào! Tôi là GTN Assistant. Bạn cần hỗ trợ gì hôm nay?" }]);
    }
  }, [isOpen]);

  const sendMessage = async () => {
    if (!input.trim()) return;
    const userMsg = { sender: "user", text: input };
    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setLoading(true);

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: input }),
      });

      if (!res.ok) {
        throw new Error("Failed to fetch response");
      }

      const data = await res.json();
      const botMsg = { sender: "bot", text: data.reply, link: data.link || null };
      setMessages((prev) => [...prev, botMsg]);
    } catch (error) {
      const errorMsg = { sender: "bot", text: "Xin lỗi, có lỗi xảy ra. Vui lòng thử lại sau." };
      setMessages((prev) => [...prev, errorMsg]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.chatContainer}>
      {/* Nút nổi */}
      {!isOpen && (
        <button className={styles.toggleBtn} onClick={() => setIsOpen(true)}>
          💬
        </button>
      )}

      {isOpen && (
        <div className={styles.chatBox}>
          <div className={styles.chatHeader}>
            <div className={styles.headerLeft}>
              <Image
                src="/images/logo.jpg"
                alt="GTN Logo"
                width={24}
                height={24}
                className={styles.logo}
              />
              <div className={styles.headerText}>
                <span className={styles.brand}>GTN Shop</span>
                <span className={styles.subtext}>Chat với chúng tôi</span>
              </div>
            </div>
            <button
              className={styles.closeBtn}
              onClick={() => setIsOpen(false)}
            >
              ✕
            </button>
          </div>

          <div className={styles.chatBody} ref={chatBodyRef}>
            {messages.map((msg, i) => (
              <div
                key={i}
                className={msg.sender === "user" ? styles.userMsg : styles.botMsg}
              >
                <p>{msg.text}</p>
                {msg.link && (
                  <a href={msg.link} target="_blank" rel="noopener noreferrer">
                    🔗 Xem chi tiết
                  </a>
                )}
              </div>
            ))}
            {loading && <div className={styles.botMsg}><p className={styles.loading}>Đang xử lý...</p></div>}
          </div>

          <div className={styles.chatInput}>
            <input
              type="text"
              placeholder="Nhập nội dung..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && sendMessage()}
            />
            <button onClick={sendMessage}>Gửi</button>
          </div>
        </div>
      )}
    </div>
  );
}