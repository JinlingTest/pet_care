"use client";

import { useEffect } from "react";
import { pageHtml } from "./page-content";

export default function Home() {
  useEffect(() => {
    const planSelect = document.querySelector<HTMLSelectElement>("#plan");
    const sizeSelect = document.querySelector<HTMLSelectElement>("#size");
    const petTypeSelect = document.querySelector<HTMLSelectElement>("#petType");
    const estimate = document.querySelector<HTMLElement>("#estimate");
    const form = document.querySelector<HTMLFormElement>("#bookingForm");
    const environmentSlides = Array.from(document.querySelectorAll<HTMLElement>(".environment-slide"));
    const environmentTabs = Array.from(document.querySelectorAll<HTMLElement>(".environment-tab"));
    const environmentDots = Array.from(document.querySelectorAll<HTMLElement>(".environment-dot"));
    const environmentPrev = document.querySelector<HTMLButtonElement>("#environmentPrev");
    const environmentNext = document.querySelector<HTMLButtonElement>("#environmentNext");

    if (
      !planSelect ||
      !sizeSelect ||
      !petTypeSelect ||
      !estimate ||
      !form ||
      !environmentPrev ||
      !environmentNext ||
      environmentSlides.length === 0
    ) {
      return;
    }

    const planInput = planSelect;
    const sizeInput = sizeSelect;
    const petTypeInput = petTypeSelect;
    const estimateOutput = estimate;
    const bookingForm = form;
    const prevButton = environmentPrev;
    const nextButton = environmentNext;
    let environmentIndex = 0;
    let environmentTimer: ReturnType<typeof setInterval>;

    const basePrices = [88, 138, 228];
    const durations = ["45-70 分钟", "70-100 分钟", "120-180 分钟"];

    function showEnvironmentSlide(index: number) {
      environmentIndex = (index + environmentSlides.length) % environmentSlides.length;
      environmentSlides.forEach((slide, slideIndex) => {
        slide.classList.toggle("active", slideIndex === environmentIndex);
      });
      environmentTabs.forEach((tab, slideIndex) => {
        tab.classList.toggle("active", slideIndex === environmentIndex);
      });
      environmentDots.forEach((dot, slideIndex) => {
        dot.classList.toggle("active", slideIndex === environmentIndex);
      });
    }

    function restartEnvironmentTimer() {
      clearInterval(environmentTimer);
      environmentTimer = setInterval(() => {
        showEnvironmentSlide(environmentIndex + 1);
      }, 5200);
    }

    function updateEstimate() {
      const sizeAdd = { small: 0, medium: 40, large: 90 }[sizeInput.value] ?? 0;
      const catAdd = petTypeInput.value === "cat" ? 20 : 0;
      const planIndex = Math.max(planInput.selectedIndex, 0);
      const price = (basePrices[planIndex] ?? basePrices[1]) + sizeAdd + catAdd;
      estimateOutput.textContent = `预估：¥${price} 起，约 ${durations[planIndex] ?? durations[1]}`;
    }

    const planLinks = Array.from(document.querySelectorAll<HTMLElement>("[data-plan]"));
    const environmentControls = [...environmentTabs, ...environmentDots];

    const planLinkHandlers = planLinks.map((link) => {
      const handler = () => {
        const plan = link.dataset.plan;
        if (plan) {
          planInput.value = plan;
        }
        updateEstimate();
      };
      link.addEventListener("click", handler);
      return { link, handler };
    });

    const environmentHandlers = environmentControls.map((control) => {
      const handler = () => {
        showEnvironmentSlide(Number(control.dataset.slide));
        restartEnvironmentTimer();
      };
      control.addEventListener("click", handler);
      return { control, handler };
    });

    const prevHandler = () => {
      showEnvironmentSlide(environmentIndex - 1);
      restartEnvironmentTimer();
    };
    const nextHandler = () => {
      showEnvironmentSlide(environmentIndex + 1);
      restartEnvironmentTimer();
    };
    const submitHandler = async (event: SubmitEvent) => {
      event.preventDefault();
      const formData = new FormData(bookingForm);
      estimateOutput.textContent = "正在提交预约信息...";
      try {
        const response = await fetch("/api/customer/appointments", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            owner: formData.get("owner"),
            phone: formData.get("phone"),
            password: formData.get("password"),
            petType: formData.get("petType"),
            size: formData.get("size"),
            plan: formData.get("plan"),
            note: formData.get("note")
          })
        });
        const result = await response.json();
        if (!response.ok) {
          estimateOutput.textContent = result.error || "预约提交失败，请稍后再试。";
          return;
        }
        const owner = formData.get("owner") || "主人";
        estimateOutput.textContent = `${owner}，预约已提交。你可以前往客户查询查看状态或修改预约。`;
        bookingForm.reset();
        updateEstimate();
      } catch {
        estimateOutput.textContent = "网络异常，预约提交失败。";
      }
    };

    prevButton.addEventListener("click", prevHandler);
    nextButton.addEventListener("click", nextHandler);
    bookingForm.addEventListener("submit", submitHandler);
    [planInput, sizeInput, petTypeInput].forEach((control) => {
      control.addEventListener("change", updateEstimate);
    });

    updateEstimate();
    restartEnvironmentTimer();

    return () => {
      clearInterval(environmentTimer);
      planLinkHandlers.forEach(({ link, handler }) => link.removeEventListener("click", handler));
      environmentHandlers.forEach(({ control, handler }) => control.removeEventListener("click", handler));
      prevButton.removeEventListener("click", prevHandler);
      nextButton.removeEventListener("click", nextHandler);
      bookingForm.removeEventListener("submit", submitHandler);
      [planInput, sizeInput, petTypeInput].forEach((control) => {
        control.removeEventListener("change", updateEstimate);
      });
    };
  }, []);

  return <div dangerouslySetInnerHTML={{ __html: pageHtml }} />;
}
