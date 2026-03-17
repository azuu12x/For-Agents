import { useState, useEffect } from "react";
import { MEDICAL_CONDITIONS, BASIC_COVERS, RECOMMENDED_COVERS, ADDITIONAL_COVERS } from "./data/covers";
import { fetchTravelData } from "./data/mockApi";
import "./App.css";

/* ─── Small reusable components ─── */

function Stepper({ step, steps }) {
  return (
    <div className="stepper">
      {steps.map((s, i) => (
        <div key={i} className="stepper-item">
          <div className="stepper-col">
            <div
              className="stepper-circle"
              style={{
                background: i <= step ? "var(--coral)" : "var(--border)",
                color: i <= step ? "var(--white)" : "#8993A4",
                boxShadow: i === step ? "0 0 0 4px var(--coral-light)" : "none",
              }}
            >
              {i < step ? "✓" : i + 1}
            </div>
            <span
              className="stepper-label"
              style={{
                fontWeight: i === step ? 700 : 500,
                color: i <= step ? "var(--navy)" : "#8993A4",
              }}
            >
              {s}
            </span>
          </div>
          {i < steps.length - 1 && (
            <div
              className="stepper-line"
              style={{ background: i < step ? "var(--coral)" : "var(--border)" }}
            />
          )}
        </div>
      ))}
    </div>
  );
}

function YesNoButton({ current, onSelect }) {
  return (
    <div className="yesno-group">
      <button
        onClick={() => onSelect(true)}
        className={`yesno-btn ${current === true ? "yesno-yes-active" : ""}`}
      >
        כן
      </button>
      <button
        onClick={() => onSelect(false)}
        className={`yesno-btn ${current === false ? "yesno-no-active" : ""}`}
      >
        לא
      </button>
    </div>
  );
}

function CoverCard({ cover, selected, onToggle, compact }) {
  return (
    <div
      onClick={onToggle}
      className={`cover-card ${selected ? "cover-card-selected" : ""} ${compact ? "cover-card-compact" : ""}`}
    >
      <div className="cover-card-info">
        <span className="cover-card-icon">{cover.icon}</span>
        <div>
          <div className="cover-card-name">{cover.name}</div>
          <div className="cover-card-desc">{cover.desc}</div>
        </div>
      </div>
      <div className="cover-card-price">${cover.price}/יום</div>
      <div className={`cover-card-check ${selected ? "cover-card-check-active" : ""}`}>
        {selected && "✓"}
      </div>
    </div>
  );
}

function InfoRow({ label, value, icon }) {
  return (
    <div className="info-row">
      {icon && <span className="info-row-icon">{icon}</span>}
      <div>
        <div className="info-row-label">{label}</div>
        <div className="info-row-value">{value || "—"}</div>
      </div>
    </div>
  );
}

function Card({ children, className = "", style }) {
  return (
    <div className={`card ${className}`} style={style}>
      {children}
    </div>
  );
}

function SectionTitle({ icon, children }) {
  return (
    <h3 className="section-title">
      {icon} {children}
    </h3>
  );
}

/* ─── Main App ─── */

export default function App() {
  const [step, setStep] = useState(0);
  const [apiLoaded, setApiLoaded] = useState(false);

  const [destinations, setDestinations] = useState([]);
  const [departDate, setDepartDate] = useState("");
  const [returnDate, setReturnDate] = useState("");
  const [travelers, setTravelers] = useState([]);
  const [isIsraeli, setIsIsraeli] = useState(true);
  const [agentInfo, setAgentInfo] = useState({});

  const [medicalQ1, setMedicalQ1] = useState(null);
  const [medicalQ2, setMedicalQ2] = useState(null);
  const [medicalQ3, setMedicalQ3] = useState(null);
  const [medicalQ4, setMedicalQ4] = useState(null);
  const [medicalConditions, setMedicalConditions] = useState([]);
  const [medicalTravelers, setMedicalTravelers] = useState([]);

  const [selectedCovers, setSelectedCovers] = useState(["luggage"]);

  useEffect(() => {
    fetchTravelData().then((d) => {
      setDestinations(d.destinations);
      setDepartDate(d.departDate);
      setReturnDate(d.returnDate);
      setTravelers(d.travelers);
      setIsIsraeli(d.isIsraeli);
      setAgentInfo(d.agentInfo);
      setApiLoaded(true);
    });
  }, []);

  const days = (() => {
    if (!departDate || !returnDate) return 0;
    return Math.ceil((new Date(returnDate) - new Date(departDate)) / (1000 * 60 * 60 * 24)) + 1;
  })();

  const totalPrice = (() => {
    let base = 17.1;
    const allCovers = [...RECOMMENDED_COVERS, ...ADDITIONAL_COVERS];
    selectedCovers.forEach((id) => {
      const c = allCovers.find((x) => x.id === id);
      if (c) base += c.price * days * travelers.length;
    });
    return base.toFixed(1);
  })();

  const goNext = () => setStep((s) => Math.min(s + 1, 2));
  const goBack = () => setStep((s) => Math.max(s - 1, 0));
  const toggleCover = (id) =>
    setSelectedCovers((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );

  const formatDateDisplay = (d) => {
    if (!d) return "—";
    const dt = new Date(d);
    return `${String(dt.getDate()).padStart(2, "0")}/${String(dt.getMonth() + 1).padStart(2, "0")}/${dt.getFullYear()}`;
  };

  const allCoversList = [...BASIC_COVERS, ...RECOMMENDED_COVERS, ...ADDITIONAL_COVERS];

  /* Loading */
  if (!apiLoaded) {
    return (
      <div className="loading-screen">
        <div className="loading-spinner" />
        <div className="loading-text">טוען נתונים מהמערכת...</div>
      </div>
    );
  }

  return (
    <div className="app">
      {/* Header */}
      <header className="header">
        <div className="header-right">
          <img src="/logo.png" alt="ביטוח ישיר" className="header-logo" />
          <div className="header-divider" />
          <span className="header-title">ביטוח נסיעות לחו״ל</span>
        </div>
        <div className="header-price-box">
          <span className="header-price-label">לתשלום:</span>
          <span className="header-price-value">${totalPrice}</span>
        </div>
      </header>

      <main className="main">
        {/* Doks badge */}
        <div className="doks-badge-wrapper">
          <div className="doks-badge">
            דוקס: {agentInfo.doksId} | {agentInfo.company} סניף{" "}
            {agentInfo.branch}
          </div>
        </div>

        <Stepper
          step={step}
          steps={["פרטי נסיעה", "בריאות וכיסויים", "סיכום ואישור"]}
        />

        {/* ═══════════ PAGE 1 ═══════════ */}
        {step === 0 && (
          <div className="fade-in">
            {/* Marketing Hero */}
            <Card className="hero-card">
              <h2 className="hero-title">ביטוח נסיעות לחו״ל</h2>
              <p className="hero-sub">
                הביטוח שנותן לך שקט נפשי מלא בכל מקום בעולם
              </p>
              <div className="hero-features">
                {[
                  { icon: "🩺", text: "Air Doctor ללא עלות", sub: "רופא בכל מקום 24/7" },
                  { icon: "🛡️", text: "כיסוי עד $5,000,000", sub: "לאשפוז וחילוץ" },
                  { icon: "⚡", text: "תהליך מהיר", sub: "3 שלבים פשוטים" },
                ].map((b, i) => (
                  <div key={i} className="hero-feature-card">
                    <div className="hero-feature-icon">{b.icon}</div>
                    <div className="hero-feature-text">{b.text}</div>
                    <div className="hero-feature-sub">{b.sub}</div>
                  </div>
                ))}
              </div>
            </Card>

            {/* Trip Info */}
            <Card>
              <SectionTitle icon="🌍">פרטי הנסיעה</SectionTitle>
              <div className="info-grid">
                <InfoRow label="יעד" value={destinations.join(", ")} icon="📍" />
                <InfoRow label="ימי ביטוח" value={`${days} ימים`} icon="📅" />
                <InfoRow label="תאריך יציאה" value={formatDateDisplay(departDate)} icon="🛫" />
                <InfoRow label="תאריך חזרה" value={formatDateDisplay(returnDate)} icon="🛬" />
              </div>
            </Card>

            {/* Travelers */}
            <Card>
              <SectionTitle icon="👥">נוסעים ({travelers.length})</SectionTitle>
              <div className="travelers-list">
                {travelers.map((t, i) => (
                  <div
                    key={i}
                    className={`traveler-card ${i === 0 ? "traveler-primary" : ""}`}
                  >
                    <div className={`traveler-avatar ${i === 0 ? "traveler-avatar-primary" : ""}`}>
                      {t.fullName?.split(" ").map((n) => n[0]).join("").substring(0, 2)}
                    </div>
                    <div className="traveler-info">
                      <div className="traveler-name">{t.fullName}</div>
                      <div className="traveler-meta">
                        {i === 0 ? "בעל הפוליסה" : "נוסע נוסף"} • ת.ז.{" "}
                        {t.idNumber} • {t.phone}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </Card>

            {/* Israeli */}
            <Card>
              <div className="question-text">
                האם הביטוח נרכש בישראל, לפני הנסיעה, וכל הנוסעים בעלי אזרחות
                ישראלית?
              </div>
              <YesNoButton current={isIsraeli} onSelect={setIsIsraeli} />
            </Card>

            <button onClick={goNext} className="btn-primary btn-full">
              המשך לשאלון בריאות וכיסויים ←
            </button>
          </div>
        )}

        {/* ═══════════ PAGE 2 ═══════════ */}
        {step === 1 && (
          <div className="fade-in">
            {/* Air Doctor banner */}
            <Card className="airdoctor-card">
              <div className="airdoctor-inner">
                <span className="airdoctor-icon">🩺</span>
                <div>
                  <div className="airdoctor-title">
                    שירות Air Doctor – ללא עלות!
                  </div>
                  <div className="airdoctor-desc">
                    רופא רשמי מכל מקום בעולם, 24/7, כלול בחינם עבור כל הנוסעים
                  </div>
                </div>
              </div>
            </Card>

            {/* Basic covers */}
            <Card>
              <SectionTitle icon="🛡️">כיסויים בסיסיים</SectionTitle>
              <p className="section-sub">כלולים בתוכנית – ללא עלות נוספת</p>
              <div className="covers-stack">
                {BASIC_COVERS.map((c) => (
                  <div key={c.id} className="basic-cover-row">
                    <div className="basic-cover-info">
                      <span>{c.icon}</span>
                      <div>
                        <div className="basic-cover-name">✅ {c.name}</div>
                        <div className="basic-cover-desc">{c.desc}</div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </Card>

            {/* Recommended */}
            <Card>
              <SectionTitle icon="⭐">מומלץ להוסיף</SectionTitle>
              <p className="section-sub">כיסויים פופולריים לנסיעה</p>
              <div className="covers-stack">
                {RECOMMENDED_COVERS.map((c) => (
                  <CoverCard
                    key={c.id}
                    cover={c}
                    selected={selectedCovers.includes(c.id)}
                    onToggle={() => toggleCover(c.id)}
                  />
                ))}
              </div>
            </Card>

            {/* Separator */}
            <div className="separator">
              <div className="separator-line" />
              <span className="separator-text separator-text-coral">שאלון בריאות</span>
              <div className="separator-line" />
            </div>

            {/* Medical */}
            <Card>
              <SectionTitle icon="❤️">שאלון בריאות</SectionTitle>
              <p className="section-sub">
                תכנית הביטוח הבסיסית אינה מכסה הוצאות שקשורות למצב רפואי קיים.
              </p>

              {/* Q1 */}
              <div className="question-block">
                <div className="question-text">
                  האם מטרת הנסיעה היא קבלת טיפול רפואי בחו״ל, או שהתקבלה המלצה
                  מרופא/ה שלא לטוס כלל?
                </div>
                <YesNoButton current={medicalQ1} onSelect={setMedicalQ1} />
              </div>

              {/* Q2 */}
              <div className="question-block">
                <div className="question-text">
                  האם אחד או יותר מהנוסעים הופנה בחצי השנה האחרונה לבירור: MRI
                  ראש, CT ראש, אקו לב, דופלר, בדיקת מאמץ, הולטר?
                </div>
                <div className="question-note">
                  *אין צורך להשיב "כן" אם הבירור נעשה לצורך מעקב שגרתי.
                </div>
                <YesNoButton current={medicalQ2} onSelect={setMedicalQ2} />
              </div>

              {/* Q3 */}
              <div className="question-block">
                <div className="question-text">
                  האם במהלך ששת החודשים האחרונים חלה החמרה במצב הרפואי או התקבלה
                  אבחנה חדשה, טיפול או מעקב רפואי כמו ניתוח או אשפוז?
                </div>
                <div className="question-note">
                  *אין צורך להשיב "כן" אם מדובר בנטילת תרופות בלבד.
                </div>
                <YesNoButton
                  current={medicalQ3}
                  onSelect={(v) => {
                    setMedicalQ3(v);
                    if (v === true) setMedicalQ4(null);
                  }}
                />
              </div>

              {/* Q4 - only if Q3 = NO */}
              {medicalQ3 === false && (
                <div className="question-block question-block-yellow fade-in">
                  <div className="question-text">
                    האם במהלך ששת החודשים האחרונים נטלת או הומלץ לך ליטול תרופות
                    מרשם באופן קבוע?
                  </div>
                  <div className="question-note-box">
                    *אין צורך להשיב "כן" במידה ומדובר ב: גלולות למניעת הריון,
                    ויטמינים, הורמונים, טיפול תרופתי הקשור לאלרגיה, קשב וריכוז,
                    מיגרנות, בעיות שינה, דילול דם מניעתי שלא כתוצאה מטיפול
                    רפואי, כולסטרול, לחץ דם, תת פעילות בלוטת התריס או צרבת.
                  </div>
                  <YesNoButton current={medicalQ4} onSelect={setMedicalQ4} />
                </div>
              )}

              {/* Medical conditions */}
              {(medicalQ3 === true ||
                medicalQ2 === true ||
                medicalQ4 === true) && (
                <div className="conditions-block fade-in">
                  <div className="conditions-title">מי מבין הנוסעים?</div>
                  <div className="conditions-travelers">
                    {travelers.map((t, i) => (
                      <button
                        key={i}
                        onClick={() =>
                          setMedicalTravelers((prev) =>
                            prev.includes(i)
                              ? prev.filter((x) => x !== i)
                              : [...prev, i]
                          )
                        }
                        className={`conditions-traveler-btn ${medicalTravelers.includes(i) ? "active" : ""}`}
                      >
                        {t.fullName}
                      </button>
                    ))}
                  </div>
                  {medicalTravelers.length > 0 && (
                    <div className="conditions-list">
                      <div className="conditions-subtitle">
                        סמנו את המצבים הרפואיים הרלוונטיים:
                      </div>
                      {MEDICAL_CONDITIONS.map((cond) => (
                        <label
                          key={cond}
                          className={`condition-item ${medicalConditions.includes(cond) ? "condition-item-active" : ""}`}
                        >
                          <input
                            type="checkbox"
                            checked={medicalConditions.includes(cond)}
                            onChange={() =>
                              setMedicalConditions((prev) =>
                                prev.includes(cond)
                                  ? prev.filter((x) => x !== cond)
                                  : [
                                      ...prev.filter((x) => x !== "none"),
                                      cond,
                                    ]
                              )
                            }
                          />
                          {cond}
                        </label>
                      ))}
                      <label
                        className={`condition-item condition-item-green ${medicalConditions.includes("none") ? "condition-item-green-active" : ""}`}
                      >
                        <input
                          type="checkbox"
                          checked={medicalConditions.includes("none")}
                          onChange={() => setMedicalConditions(["none"])}
                        />
                        אף אחד מהמצבים המפורטים
                      </label>
                    </div>
                  )}
                </div>
              )}
            </Card>

            {/* Separator */}
            <div className="separator">
              <div className="separator-line" />
              <span className="separator-text">כיסויים נוספים</span>
              <div className="separator-line" />
            </div>

            {/* Additional covers */}
            <Card>
              <SectionTitle icon="➕">כיסויים נוספים</SectionTitle>
              <p className="section-sub">התאימו את הביטוח לאופי הנסיעה</p>
              <div className="covers-stack">
                {ADDITIONAL_COVERS.map((c) => (
                  <CoverCard
                    key={c.id}
                    cover={c}
                    selected={selectedCovers.includes(c.id)}
                    onToggle={() => toggleCover(c.id)}
                    compact
                  />
                ))}
              </div>
            </Card>

            <div className="btn-row">
              <button onClick={goBack} className="btn-secondary">
                → חזרה
              </button>
              <button onClick={goNext} className="btn-primary btn-wide">
                המשך לסיכום ←
              </button>
            </div>
          </div>
        )}

        {/* ═══════════ PAGE 3 ═══════════ */}
        {step === 2 && (
          <div className="fade-in">
            <Card>
              <h3 className="summary-title">📋 סיכום הזמנה</h3>

              {/* Trip */}
              <div className="summary-section">
                <div className="summary-section-title">🌍 פרטי נסיעה</div>
                <div className="summary-grid">
                  <div>
                    <strong>יעד: </strong>
                    {destinations.join(", ")}
                  </div>
                  <div>
                    <strong>תאריכים: </strong>
                    {formatDateDisplay(departDate)} –{" "}
                    {formatDateDisplay(returnDate)}
                  </div>
                  <div>
                    <strong>ימי ביטוח: </strong>
                    {days}
                  </div>
                  <div>
                    <strong>נוסעים: </strong>
                    {travelers.length}
                  </div>
                </div>
              </div>

              <hr className="summary-hr" />

              {/* Covers per traveler TABLE */}
              <div className="summary-section">
                <div className="summary-section-title">🛡️ כיסויים למבוטחים</div>
                <div className="table-wrapper">
                  <table className="covers-table">
                    <thead>
                      <tr>
                        <th className="covers-table-th-right">כיסוי</th>
                        {travelers.map((t, i) => (
                          <th key={i} className="covers-table-th-center">
                            {t.fullName.split(" ")[0]}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      <tr className="covers-table-air">
                        <td>🩺 Air Doctor</td>
                        {travelers.map((_, i) => (
                          <td key={i} className="covers-table-check">
                            ✓
                          </td>
                        ))}
                      </tr>
                      {allCoversList.map((cover, ci) => {
                        const isSelected =
                          selectedCovers.includes(cover.id) ||
                          cover.id === "hospital" ||
                          cover.id === "thirdparty";
                        if (!isSelected) return null;
                        return (
                          <tr
                            key={cover.id}
                            className={ci % 2 === 0 ? "covers-table-even" : ""}
                          >
                            <td>
                              {cover.icon} {cover.name}
                            </td>
                            {travelers.map((_, ti) => (
                              <td key={ti} className="covers-table-check">
                                ✓
                              </td>
                            ))}
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>

              <hr className="summary-hr" />

              {/* Medical summary */}
              <div className="summary-section">
                <div className="summary-section-title">❤️ בריאות</div>
                <div className="summary-medical">
                  <div>
                    טיפול רפואי:{" "}
                    <span className={medicalQ1 ? "text-red" : "text-green"}>
                      {medicalQ1 == null ? "—" : medicalQ1 ? "כן" : "לא"}
                    </span>
                  </div>
                  <div>
                    בדיקות פתוחות:{" "}
                    <span className={medicalQ2 ? "text-red" : "text-green"}>
                      {medicalQ2 == null ? "—" : medicalQ2 ? "כן" : "לא"}
                    </span>
                  </div>
                  <div>
                    החמרה/אבחנה:{" "}
                    <span className={medicalQ3 ? "text-red" : "text-green"}>
                      {medicalQ3 == null ? "—" : medicalQ3 ? "כן" : "לא"}
                    </span>
                  </div>
                  {medicalQ3 === false && (
                    <div>
                      תרופות מרשם:{" "}
                      <span className={medicalQ4 ? "text-red" : "text-green"}>
                        {medicalQ4 == null ? "—" : medicalQ4 ? "כן" : "לא"}
                      </span>
                    </div>
                  )}
                </div>
              </div>

              <hr className="summary-hr" />

              {/* Contact */}
              <div className="summary-section">
                <div className="summary-section-title">📞 פרטי התקשרות</div>
                <div className="summary-contact">
                  <div>טלפון: {travelers[0]?.phone}</div>
                  <div>מייל: {travelers[0]?.email}</div>
                </div>
              </div>

              {/* Total */}
              <div className="summary-total">
                <span className="summary-total-label">סה״כ לתשלום</span>
                <span className="summary-total-value">${totalPrice}</span>
              </div>
            </Card>

            {/* Agent email */}
            <Card>
              <div className="agent-email-label">
                מייל סוכן (לשליחת הפוליסה)
              </div>
              <input
                type="email"
                placeholder="agent@example.com"
                className="agent-email-input"
              />
            </Card>

            <div className="btn-row">
              <button onClick={goBack} className="btn-secondary">
                → חזרה
              </button>
              <button className="btn-success btn-wide">אישור ותשלום ✓</button>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
