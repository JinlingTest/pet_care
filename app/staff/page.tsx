"use client";

import { FormEvent, useEffect, useState } from "react";
import Link from "next/link";

type Employee = {
  id: string;
  username: string;
  name: string;
  role: "ADMIN" | "STAFF";
  isActive?: boolean;
};

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
  customer?: { name: string; phone: string };
};

const statusText: Record<string, string> = {
  pending: "待确认",
  confirmed: "已确认",
  in_service: "服务中",
  completed: "已完成",
  cancelled: "已取消"
};

const statusOptions = [
  ["pending", "待确认"],
  ["confirmed", "已确认"],
  ["in_service", "服务中"],
  ["completed", "已完成"],
  ["cancelled", "已取消"]
];

export default function StaffPage() {
  const [needsSetup, setNeedsSetup] = useState(false);
  const [employee, setEmployee] = useState<Employee | null>(null);
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [statusFilter, setStatusFilter] = useState("all");
  const [message, setMessage] = useState("");

  async function loadBootstrapState() {
    const response = await fetch("/api/staff/bootstrap");
    const result = await response.json();
    setNeedsSetup(Boolean(result.needsSetup));
  }

  async function loadMe() {
    const response = await fetch("/api/staff/me");
    if (!response.ok) {
      setEmployee(null);
      return;
    }
    const result = await response.json();
    setEmployee(result.employee);
  }

  async function loadAppointments(nextFilter = statusFilter) {
    const response = await fetch(`/api/staff/appointments?status=${nextFilter}`);
    if (!response.ok) {
      return;
    }
    const result = await response.json();
    setAppointments(result.appointments || []);
  }

  async function loadEmployees() {
    const response = await fetch("/api/staff/employees");
    if (!response.ok) {
      return;
    }
    const result = await response.json();
    setEmployees(result.employees || []);
  }

  useEffect(() => {
    loadBootstrapState();
    loadMe();
  }, []);

  useEffect(() => {
    if (employee) {
      loadAppointments();
      if (employee.role === "ADMIN") {
        loadEmployees();
      }
    }
  }, [employee]);

  async function handleLogout() {
    await fetch("/api/staff/logout", { method: "POST" });
    setEmployee(null);
    setAppointments([]);
    setEmployees([]);
    setMessage("已退出登录");
    await loadBootstrapState();
  }

  return (
    <main className="portal-page">
      <section className="portal-shell wide">
        <div className="portal-header">
          <div>
            <Link className="portal-back" href="/">
              返回首页
            </Link>
            <h1>员工后台</h1>
            <p>管理预约状态、查看客户备注，并维护员工账号。</p>
          </div>
          {employee ? (
            <button className="btn secondary" type="button" onClick={handleLogout}>
              退出登录
            </button>
          ) : null}
        </div>

        {message ? <div className="portal-message">{message}</div> : null}

        {!employee ? (
          <div className="staff-auth-grid">
            {needsSetup ? (
              <BootstrapCard
                onDone={async (nextEmployee) => {
                  setEmployee(nextEmployee);
                  setNeedsSetup(false);
                  setMessage("管理员已创建");
                }}
              />
            ) : null}
            <StaffLoginCard
              onDone={async (nextEmployee) => {
                setEmployee(nextEmployee);
                setMessage("登录成功");
              }}
            />
          </div>
        ) : (
          <div className="dashboard-grid">
            <section className="portal-card dashboard-main">
              <div className="dashboard-toolbar">
                <div>
                  <h2>预约列表</h2>
                  <p>{employee.name} · {employee.role === "ADMIN" ? "管理员" : "员工"}</p>
                </div>
                <label>
                  状态筛选
                  <select
                    value={statusFilter}
                    onChange={async (event) => {
                      setStatusFilter(event.target.value);
                      await loadAppointments(event.target.value);
                    }}
                  >
                    <option value="all">全部</option>
                    {statusOptions.map(([value, label]) => (
                      <option key={value} value={value}>
                        {label}
                      </option>
                    ))}
                  </select>
                </label>
              </div>
              <div className="staff-table">
                {appointments.map((appointment) => (
                  <StaffAppointmentRow
                    key={appointment.id}
                    appointment={appointment}
                    onUpdated={async (text) => {
                      setMessage(text);
                      await loadAppointments();
                    }}
                  />
                ))}
                {appointments.length === 0 ? <div className="empty-state">暂无预约。</div> : null}
              </div>
            </section>

            {employee.role === "ADMIN" ? (
              <section className="portal-card">
                <h2>员工管理</h2>
                <EmployeeCreateForm
                  onCreated={async () => {
                    setMessage("员工已创建");
                    await loadEmployees();
                  }}
                />
                <div className="employee-list">
                  {employees.map((item) => (
                    <EmployeeRow
                      key={item.id}
                      employee={item}
                      onUpdated={async () => {
                        setMessage("员工信息已更新");
                        await loadEmployees();
                      }}
                    />
                  ))}
                </div>
              </section>
            ) : null}
          </div>
        )}
      </section>
    </main>
  );
}

function BootstrapCard({ onDone }: { onDone: (employee: Employee) => void }) {
  return <AuthForm title="初始化管理员" action="/api/staff/bootstrap" buttonText="创建管理员" onDone={onDone} withName />;
}

function StaffLoginCard({ onDone }: { onDone: (employee: Employee) => void }) {
  return <AuthForm title="员工登录" action="/api/staff/login" buttonText="登录后台" onDone={onDone} />;
}

function AuthForm({
  title,
  action,
  buttonText,
  withName = false,
  onDone
}: {
  title: string;
  action: string;
  buttonText: string;
  withName?: boolean;
  onDone: (employee: Employee) => void;
}) {
  const [username, setUsername] = useState("");
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const response = await fetch(action, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, name, password })
    });
    const result = await response.json();
    if (!response.ok) {
      setMessage(result.error || "操作失败");
      return;
    }
    onDone(result.employee);
  }

  return (
    <form className="portal-card auth-card" onSubmit={submit}>
      <h2>{title}</h2>
      <label>
        用户名
        <input value={username} onChange={(event) => setUsername(event.target.value)} required />
      </label>
      {withName ? (
        <label>
          姓名
          <input value={name} onChange={(event) => setName(event.target.value)} required />
        </label>
      ) : null}
      <label>
        密码
        <input value={password} onChange={(event) => setPassword(event.target.value)} type="password" minLength={6} required />
      </label>
      <button className="btn" type="submit">
        {buttonText}
      </button>
      {message ? <div className="portal-message">{message}</div> : null}
    </form>
  );
}

function StaffAppointmentRow({
  appointment,
  onUpdated
}: {
  appointment: Appointment;
  onUpdated: (message: string) => Promise<void>;
}) {
  const [status, setStatus] = useState(appointment.status);
  const [staffNote, setStaffNote] = useState(appointment.staffNote || "");

  async function save() {
    const response = await fetch(`/api/staff/appointments/${appointment.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status, staffNote })
    });
    const result = await response.json();
    await onUpdated(response.ok ? "预约状态已更新" : result.error || "更新失败");
  }

  return (
    <article className="staff-row">
      <div>
        <strong>{appointment.ownerName}</strong>
        <span>{appointment.phone}</span>
      </div>
      <div>
        <strong>{appointment.plan}</strong>
        <span>{appointment.petType === "cat" ? "猫咪" : "狗狗"} · {sizeText(appointment.size)} · ¥{appointment.estimatedPrice}</span>
      </div>
      <label>
        状态
        <select value={status} onChange={(event) => setStatus(event.target.value)}>
          {statusOptions.map(([value, label]) => (
            <option key={value} value={value}>
              {label}
            </option>
          ))}
        </select>
      </label>
      <label>
        员工备注
        <input value={staffNote} onChange={(event) => setStaffNote(event.target.value)} placeholder="例如：已电话确认" />
      </label>
      <div className="staff-row-actions">
        <span className={`status-pill status-${appointment.status}`}>{statusText[appointment.status]}</span>
        <button className="btn" type="button" onClick={save}>
          保存
        </button>
      </div>
      {appointment.note ? <p className="row-note">客户备注：{appointment.note}</p> : null}
    </article>
  );
}

function EmployeeCreateForm({ onCreated }: { onCreated: () => Promise<void> }) {
  const [username, setUsername] = useState("");
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState<"ADMIN" | "STAFF">("STAFF");

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const response = await fetch("/api/staff/employees", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, name, password, role })
    });
    if (response.ok) {
      setUsername("");
      setName("");
      setPassword("");
      setRole("STAFF");
      await onCreated();
    }
  }

  return (
    <form className="employee-form" onSubmit={submit}>
      <input value={username} onChange={(event) => setUsername(event.target.value)} placeholder="用户名" required />
      <input value={name} onChange={(event) => setName(event.target.value)} placeholder="姓名" required />
      <input value={password} onChange={(event) => setPassword(event.target.value)} type="password" placeholder="初始密码" minLength={6} required />
      <select value={role} onChange={(event) => setRole(event.target.value as "ADMIN" | "STAFF")}>
        <option value="STAFF">员工</option>
        <option value="ADMIN">管理员</option>
      </select>
      <button className="btn" type="submit">
        创建员工
      </button>
    </form>
  );
}

function EmployeeRow({ employee, onUpdated }: { employee: Employee; onUpdated: () => Promise<void> }) {
  const [password, setPassword] = useState("");

  async function patch(data: Record<string, unknown>) {
    const response = await fetch(`/api/staff/employees/${employee.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data)
    });
    if (response.ok) {
      await onUpdated();
      setPassword("");
    }
  }

  return (
    <article className="employee-row">
      <div>
        <strong>{employee.name}</strong>
        <span>{employee.username} · {employee.role === "ADMIN" ? "管理员" : "员工"} · {employee.isActive ? "启用" : "停用"}</span>
      </div>
      <input value={password} onChange={(event) => setPassword(event.target.value)} type="password" placeholder="重置密码" />
      <button className="btn secondary" type="button" disabled={password.length < 6} onClick={() => patch({ password })}>
        重置
      </button>
      <button className="btn secondary" type="button" onClick={() => patch({ isActive: !employee.isActive })}>
        {employee.isActive ? "停用" : "启用"}
      </button>
    </article>
  );
}

function sizeText(size: string) {
  return { small: "小型", medium: "中型", large: "大型" }[size] || size;
}
