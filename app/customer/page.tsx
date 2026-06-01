"use client";

import { FormEvent, useEffect, useMemo, useState } from "react";
import Link from "next/link";

type Appointment = {
  id: string;
  ownerName: string;
  phone: string;
  petType: string;
  size: string;
  plan: string;
  note: string | null;
  estimatedPrice: number;
  status: string;
  staffNote: string | null;
  createdAt: string;
  updatedAt: string;
};

const statusText: Record<string, string> = {
  pending: "待确认",
  confirmed: "已确认",
  in_service: "服务中",
  completed: "已完成",
  cancelled: "已取消"
};

const editableStatuses = new Set(["pending", "confirmed"]);

export default function CustomerPage() {
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [message, setMessage] = useState("");
  const [isAuthed, setIsAuthed] = useState(false);
  const [loading, setLoading] = useState(false);

  const hasAppointments = appointments.length > 0;

  async function loadAppointments() {
    const response = await fetch("/api/customer/appointments");
    if (response.status === 401) {
      setIsAuthed(false);
      setAppointments([]);
      return;
    }
    const result = await response.json();
    setAppointments(result.appointments || []);
    setIsAuthed(true);
  }

  useEffect(() => {
    loadAppointments();
  }, []);

  async function handleLogin(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);
    setMessage("正在登录...");
    const response = await fetch("/api/customer/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ phone, password })
    });
    const result = await response.json();
    setLoading(false);
    if (!response.ok) {
      setMessage(result.error || "登录失败");
      return;
    }
    setMessage("登录成功");
    await loadAppointments();
  }

  async function handleLogout() {
    await fetch("/api/customer/logout", { method: "POST" });
    setIsAuthed(false);
    setAppointments([]);
    setMessage("已退出登录");
  }

  async function updateAppointment(id: string, data: Record<string, unknown>) {
    setMessage("正在更新预约...");
    const response = await fetch(`/api/customer/appointments/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data)
    });
    const result = await response.json();
    if (!response.ok) {
      setMessage(result.error || "更新失败");
      return;
    }
    setMessage("预约已更新");
    await loadAppointments();
  }

  return (
    <main className="portal-page">
      <section className="portal-shell">
        <div className="portal-header">
          <div>
            <Link className="portal-back" href="/">
              返回首页
            </Link>
            <h1>客户预约查询</h1>
            <p>使用预约手机号和密码登录后，可以查看预约进度，修改未开始的预约内容。</p>
          </div>
          {isAuthed ? (
            <button className="btn secondary" type="button" onClick={handleLogout}>
              退出登录
            </button>
          ) : null}
        </div>

        {!isAuthed ? (
          <form className="portal-card auth-card" onSubmit={handleLogin}>
            <label>
              手机号
              <input value={phone} onChange={(event) => setPhone(event.target.value)} inputMode="tel" required />
            </label>
            <label>
              密码
              <input
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                type="password"
                minLength={6}
                required
              />
            </label>
            <button className="btn" type="submit" disabled={loading}>
              登录查询
            </button>
            {message ? <div className="portal-message">{message}</div> : null}
          </form>
        ) : (
          <>
            {message ? <div className="portal-message">{message}</div> : null}
            <div className="appointment-grid">
              {hasAppointments ? (
                appointments.map((appointment) => (
                  <CustomerAppointmentCard
                    key={appointment.id}
                    appointment={appointment}
                    onSave={updateAppointment}
                  />
                ))
              ) : (
                <div className="portal-card empty-state">当前账号还没有预约记录。</div>
              )}
            </div>
          </>
        )}
      </section>
    </main>
  );
}

function CustomerAppointmentCard({
  appointment,
  onSave
}: {
  appointment: Appointment;
  onSave: (id: string, data: Record<string, unknown>) => Promise<void>;
}) {
  const [petType, setPetType] = useState(appointment.petType);
  const [size, setSize] = useState(appointment.size);
  const [plan, setPlan] = useState(appointment.plan);
  const [note, setNote] = useState(appointment.note || "");

  const canEdit = editableStatuses.has(appointment.status);
  const createdAt = useMemo(() => new Date(appointment.createdAt).toLocaleString("zh-CN"), [appointment.createdAt]);

  return (
    <article className="portal-card appointment-card">
      <div className="appointment-card-head">
        <div>
          <h2>{appointment.plan}</h2>
          <p>{createdAt}</p>
        </div>
        <span className={`status-pill status-${appointment.status}`}>{statusText[appointment.status] || appointment.status}</span>
      </div>

      <div className="appointment-meta">
        <span>主人：{appointment.ownerName}</span>
        <span>电话：{appointment.phone}</span>
        <span>预估：¥{appointment.estimatedPrice}</span>
      </div>

      <div className="form-grid compact">
        <label>
          宠物类型
          <select value={petType} onChange={(event) => setPetType(event.target.value)} disabled={!canEdit}>
            <option value="dog">狗狗</option>
            <option value="cat">猫咪</option>
          </select>
        </label>
        <label>
          体型
          <select value={size} onChange={(event) => setSize(event.target.value)} disabled={!canEdit}>
            <option value="small">小型</option>
            <option value="medium">中型</option>
            <option value="large">大型</option>
          </select>
        </label>
        <label className="full">
          套餐
          <select value={plan} onChange={(event) => setPlan(event.target.value)} disabled={!canEdit}>
            <option value="清爽基础洗">清爽基础洗</option>
            <option value="全套护理洗">全套护理洗</option>
            <option value="造型精修">造型精修</option>
          </select>
        </label>
        <label className="full">
          补充说明
          <textarea value={note} onChange={(event) => setNote(event.target.value)} disabled={!canEdit} />
        </label>
      </div>

      {appointment.staffNote ? <div className="staff-note">门店备注：{appointment.staffNote}</div> : null}

      <div className="row-actions">
        <button
          className="btn"
          type="button"
          disabled={!canEdit}
          onClick={() => onSave(appointment.id, { petType, size, plan, note })}
        >
          保存修改
        </button>
        <button
          className="btn secondary"
          type="button"
          disabled={!canEdit}
          onClick={() => onSave(appointment.id, { cancel: true })}
        >
          取消预约
        </button>
      </div>
    </article>
  );
}
