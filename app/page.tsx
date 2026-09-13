"use client";

import { useEffect, useRef, useState } from "react";
import * as THREE from "three";

type Item = {
  id: string;
  name: string;
  detail: string;
  price: number;
  tone: string;
  icon: string;
  kind: "desk" | "chair" | "accessory";
};
const items: Record<Item["kind"], Item[]> = {
  desk: [
    {
      id: "desk-arc",
      name: "Arc Desk",
      detail: "Oak veneer · 120 × 60 cm",
      price: 18,
      tone: "#b87752",
      icon: "▱",
      kind: "desk",
    },
    {
      id: "desk-line",
      name: "Line Desk",
      detail: "Ash top · 140 × 70 cm",
      price: 24,
      tone: "#d19d72",
      icon: "▱",
      kind: "desk",
    },
  ],
  chair: [
    {
      id: "chair-soft",
      name: "Soft Task",
      detail: "Clay fabric · adjustable",
      price: 16,
      tone: "#c97853",
      icon: "◒",
      kind: "chair",
    },
    {
      id: "chair-frame",
      name: "Frame Chair",
      detail: "Sage mesh · ergonomic",
      price: 21,
      tone: "#718675",
      icon: "◒",
      kind: "chair",
    },
  ],
  accessory: [
    {
      id: "monitor-wide",
      name: "Wide Monitor",
      detail: "27” · QHD display",
      price: 12,
      tone: "#64727b",
      icon: "▣",
      kind: "accessory",
    },
    {
      id: "lamp-orbit",
      name: "Orbit Lamp",
      detail: "Warm LED · dimmable",
      price: 7,
      tone: "#e0a94b",
      icon: "◉",
      kind: "accessory",
    },
    {
      id: "plant-rubber",
      name: "Rubber Plant",
      detail: "Low light · ceramic pot",
      price: 5,
      tone: "#6f866a",
      icon: "✦",
      kind: "accessory",
    },
    {
      id: "organizer",
      name: "Desk Tray",
      detail: "Walnut · cable tidy",
      price: 4,
      tone: "#8b6b54",
      icon: "▰",
      kind: "accessory",
    },
  ],
};
const categories: { id: Item["kind"]; label: string; note: string }[] = [
  { id: "desk", label: "Desks", note: "the foundation" },
  { id: "chair", label: "Chairs", note: "find your posture" },
  { id: "accessory", label: "Accessories", note: "finish the ritual" },
];

function Stage({ selections }: { selections: Item[] }) {
  const mount = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (!mount.current) return;
    const container = mount.current;
    const scene = new THREE.Scene();
    scene.background = new THREE.Color("#e9eee7");
    const camera = new THREE.OrthographicCamera(-5, 5, 3.35, -3.35, 0.1, 100);
    camera.position.set(7, 7, 9);
    camera.lookAt(0, 0, 0);
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setSize(container.clientWidth, container.clientHeight);
    renderer.shadowMap.enabled = true;
    container.appendChild(renderer.domElement);
    scene.add(new THREE.AmbientLight("#fff9ef", 2.3));
    const key = new THREE.DirectionalLight("#fff5db", 3);
    key.position.set(-4, 8, 5);
    key.castShadow = true;
    scene.add(key);
    const material = (color: string) =>
      new THREE.MeshStandardMaterial({ color, roughness: 0.74 });
    const addBox = (
      size: [number, number, number],
      position: [number, number, number],
      color: string,
    ) => {
      const mesh = new THREE.Mesh(
        new THREE.BoxGeometry(...size),
        material(color),
      );
      mesh.position.set(...position);
      mesh.castShadow = true;
      mesh.receiveShadow = true;
      scene.add(mesh);
      return mesh;
    };
    const floor = new THREE.Mesh(
      new THREE.CircleGeometry(5.8, 64),
      material("#dfe8dd"),
    );
    floor.rotation.x = -Math.PI / 2;
    floor.receiveShadow = true;
    scene.add(floor);
    addBox(
      [4.9, 0.22, 1.8],
      [0, 1.15, 0],
      selections.find((x) => x.kind === "desk")?.tone ?? "#b87752",
    );
    addBox([0.18, 1.1, 0.18], [-2.05, 0.55, -0.6], "#8b624d");
    addBox([0.18, 1.1, 0.18], [2.05, 0.55, -0.6], "#8b624d");
    addBox([1.4, 0.14, 1.1], [0, 0.26, 1.45], "#d0a27c");
    const chair = selections.find((x) => x.kind === "chair");
    addBox([1.05, 1.45, 0.55], [0, 0.9, 2.05], chair?.tone ?? "#c97853");
    addBox([1.35, 0.16, 0.95], [0, 0.32, 2.05], chair?.tone ?? "#c97853");
    addBox([0.12, 0.85, 0.12], [0, -0.05, 2.05], "#526057");
    if (selections.some((x) => x.id === "monitor-wide")) {
      addBox([1.55, 0.8, 0.12], [0, 2, 0.1], "#64727b");
      addBox([0.12, 0.3, 0.1], [0, 1.55, 0.1], "#58645d");
      addBox([0.65, 0.08, 0.28], [0, 1.4, 0.1], "#58645d");
    }
    if (selections.some((x) => x.id === "lamp-orbit")) {
      const arm = new THREE.Mesh(
        new THREE.CylinderGeometry(0.045, 0.045, 1.2, 16),
        material("#b0784a"),
      );
      arm.position.set(1.65, 1.9, 0.2);
      arm.rotation.z = -0.4;
      arm.castShadow = true;
      scene.add(arm);
      addBox([0.45, 0.16, 0.3], [1.98, 2.3, 0.2], "#e0a94b");
    }
    if (selections.some((x) => x.id === "plant-rubber")) {
      addBox([0.42, 0.34, 0.42], [-1.7, 1.5, 0.2], "#c2a789");
      for (const p of [
        [-1.85, 2.0, 0.2],
        [-1.6, 2.12, 0.2],
        [-1.42, 1.98, 0.2],
      ] as [number, number, number][])
        addBox([0.13, 0.6, 0.08], p, "#6f866a");
    }
    const resize = () =>
      renderer.setSize(container.clientWidth, container.clientHeight);
    window.addEventListener("resize", resize);
    let frame = 0;
    const animate = () => {
      frame = requestAnimationFrame(animate);
      scene.rotation.y = Math.sin(Date.now() * 0.00025) * 0.045;
      renderer.render(scene, camera);
    };
    animate();
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("resize", resize);
      renderer.dispose();
      container.removeChild(renderer.domElement);
    };
  }, [selections]);
  return (
    <div
      ref={mount}
      className="three-stage"
      aria-label="Live 3D workspace preview"
    />
  );
}

export default function Home() {
  const [category, setCategory] = useState<Item["kind"]>("desk");
  const [selected, setSelected] = useState<Item[]>([
    items.desk[0],
    items.chair[0],
  ]);
  const [checkout, setCheckout] = useState(false);
  
  const current = items[category];
  const total = selected.reduce((sum, item) => sum + item.price, 0);
  const choose = (item: Item) =>
    setSelected((prev) =>
      item.kind === "accessory"
        ? prev.some((x) => x.id === item.id)
          ? prev.filter((x) => x.id !== item.id)
          : [...prev, item]
        : [...prev.filter((x) => x.kind !== item.kind), item],
    );
  return (
    <main className="app-shell">
      <header className="topbar">
        <div className="brand">
          <span className="brand-mark">✳</span>
          <span>MONIS RENT</span>
        </div>
        <div className="topbar-meta">
          <span className="save-dot" /> draft saved{" "}
          <button
            className="reset-button"
            onClick={() => setSelected([items.desk[0], items.chair[0]])}
          >
            start over
          </button>
        </div>
      </header>
      <section className="intro-block">
        <div>
          <p className="eyebrow">workspace simulator / 01</p>
          <h1>
            Make a place
            <br />
            <em>to get things done.</em>
          </h1>
        </div>
        <p className="intro-copy">
          A considered setup, rented for as long as you need it. Start with the
          essentials, then add the little things that make the room yours.
        </p>
      </section>
      <section className="builder-grid">
        <aside className="catalog">
          <div className="catalog-head">
            <span className="eyebrow">Build your setup</span>
            <span className="step-count">{selected.length} selected</span>
          </div>
          <nav className="category-nav">
            {categories.map((cat) => (
              <button
                key={cat.id}
                className={category === cat.id ? "category active" : "category"}
                onClick={() => setCategory(cat.id)}
              >
                <span>{cat.label}</span>
                <small>{cat.note}</small>
                <b>↗</b>
              </button>
            ))}
          </nav>
          <div className="catalog-list">
            {current.map((item) => (
              <button
                key={item.id}
                className={
                  selected.some((x) => x.id === item.id)
                    ? "item-card chosen"
                    : "item-card"
                }
                onClick={() => choose(item)}
              >
                <span className="item-icon" style={{ background: item.tone }}>
                  {item.icon}
                </span>
                <span className="item-copy">
                  <strong>{item.name}</strong>
                  <small>{item.detail}</small>
                </span>
                <span className="item-price">
                  ${item.price}
                  <small>/ mo</small>
                </span>
                <span className="checkmark">
                  {selected.some((x) => x.id === item.id) ? "✓" : "+"}
                </span>
              </button>
            ))}
          </div>
          <p className="catalog-tip">
            All pieces are delivered flat-packed and collected when you’re ready
            to move on.
          </p>
        </aside>
        <div className="preview-panel">
          <div className="preview-toolbar">
            <span className="eyebrow">Live preview</span>
            <div className="toolbar-actions">
              <span>
                <i className="legend-swatch" /> 3D view
              </span>
              <button aria-label="More options">•••</button>
            </div>
          </div>
          <Stage selections={selected} />
          <div className="preview-note">
            <span>✦</span>
            <p>
              Click a piece to swap it. Accessories can be mixed and matched.
            </p>
          </div>
        </div>
      </section>
      <section className="checkout-bar">
        <div>
          <span className="eyebrow">Your setup</span>
          <div className="setup-chips">
            {selected.map((item) => (
              <span className="setup-chip" key={item.id}>
                <i style={{ background: item.tone }} />
                {item.name}
              </span>
            ))}
          </div>
        </div>
        <div className="total">
          <span>from</span>
          <strong>
            ${total}
            <small> / month</small>
          </strong>
        </div>
        <button className="checkout-button" onClick={() => setCheckout(true)}>
          Review setup <span>→</span>
        </button>
      </section>
      {checkout && (
        <div className="modal-backdrop" onClick={() => setCheckout(false)}>
          <div className="checkout-modal" onClick={(e) => e.stopPropagation()}>
            <button className="close" onClick={() => setCheckout(false)}>
              ×
            </button>
            <p className="eyebrow">ready when you are</p>
            <h2>
              Your workspace,
              <br />
              <em>assembled.</em>
            </h2>
            <p className="modal-copy">
              A {selected.find((x) => x.kind === "desk")?.name.toLowerCase()}{" "}
              with{" "}
              {selected.find((x) => x.kind === "chair")?.name.toLowerCase()} and{" "}
              {selected.filter((x) => x.kind === "accessory").length || "no"}{" "}
              accessories.
            </p>
            <div className="modal-lines">
              {selected.map((item) => (
                <div key={item.id}>
                  <span>{item.name}</span>
                  <b>${item.price}/mo</b>
                </div>
              ))}
              <div className="modal-total">
                <span>Monthly total</span>
                <b>${total}/mo</b>
              </div>
            </div>
            <button
              className="confirm-button"
              onClick={() => setCheckout(false)}
            >
              Save this setup <span>↗</span>
            </button>
            <small className="fine-print">
              No commitment · pause or swap anytime
            </small>
          </div>
        </div>
      )}
    </main>
  );
}
