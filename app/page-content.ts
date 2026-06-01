export const pageHtml = `<header class="topbar">
    <nav class="nav" aria-label="主导航">
      <a class="brand" href="#top" aria-label="茸净宠物洗护首页">
        <span class="brand-mark">净</span>
        <span>茸净宠物洗护</span>
      </a>
      <div class="nav-links">
        <a href="#services">服务</a>
        <a href="#process">流程</a>
        <a href="#environment">环境</a>
        <a href="#pricing">套餐</a>
        <a href="#reviews">口碑</a>
        <a href="/customer">客户查询</a>
        <a href="/staff">员工登录</a>
      </div>
      <a class="nav-cta" href="#booking">预约洗护</a>
    </nav>
  </header>

  <main id="top">
    <section class="hero" aria-label="宠物洗护首屏">
      <div class="hero-inner">
        <div class="eyebrow">猫狗分区洗护 · 一宠一消毒</div>
        <h1>让毛孩子干净、舒服、好闻地回家</h1>
        <p class="hero-copy">从皮毛状态检查到温和清洁、吹干梳理和基础护理，茸净用更细致的流程照顾敏感、胆小和长毛宠物。</p>
        <div class="hero-actions">
          <a class="btn" href="#booking">立即预约</a>
          <a class="btn secondary" href="#pricing">查看套餐</a>
        </div>
        <div class="hero-stats" aria-label="服务亮点">
          <div class="stat">
            <strong>45min</strong>
            <span>小型犬基础洗护起</span>
          </div>
          <div class="stat">
            <strong>1:1</strong>
            <span>护理师全程照看</span>
          </div>
          <div class="stat">
            <strong>0味道</strong>
            <span>低刺激香波可选</span>
          </div>
        </div>
      </div>
    </section>

    <section class="services" id="services">
      <div class="section-inner">
        <div class="section-head">
          <h2>按宠物状态定制洗护，不做流水线</h2>
          <p>每次服务前先观察皮肤、毛结、耳道和情绪，再选择水温、香波和吹干方式。</p>
        </div>
        <div class="service-grid">
          <article class="service-card">
            <div>
              <div class="service-icon">洗</div>
              <h3>温和洗澡</h3>
              <p>低刺激清洁、双遍冲洗、敏感皮肤可选无香方案。</p>
            </div>
          </article>
          <article class="service-card">
            <div>
              <div class="service-icon">护</div>
              <h3>基础护理</h3>
              <p>剪指甲、清耳、剃脚底毛、清洁腹底，减少日常打理负担。</p>
            </div>
          </article>
          <article class="service-card">
            <div>
              <div class="service-icon">梳</div>
              <h3>除浮毛梳理</h3>
              <p>针对换毛季和双层毛犬猫，减少飞毛和毛结。</p>
            </div>
          </article>
          <article class="service-card">
            <div>
              <div class="service-icon">造</div>
              <h3>精修造型</h3>
              <p>圆脸、熊系、清爽短修和局部修剪，保留宠物自然神态。</p>
            </div>
          </article>
        </div>
      </div>
    </section>

    <section class="process" id="process">
      <div class="section-inner">
        <div class="section-head">
          <h2>清晰流程，让主人放心交给我们</h2>
          <p>护理师会记录宠物状态，服务结束后同步注意事项和居家护理建议。</p>
        </div>
        <div class="steps">
          <article class="step">
            <h3>到店评估</h3>
            <p>确认年龄、体重、毛量、皮肤状态和过往洗护反应。</p>
          </article>
          <article class="step">
            <h3>分区洗护</h3>
            <p>猫狗不同区域，工具一宠一消毒，减少交叉气味和紧张感。</p>
          </article>
          <article class="step">
            <h3>吹干梳理</h3>
            <p>按宠物接受度调整风力，重点检查腋下、耳后和尾根。</p>
          </article>
          <article class="step">
            <h3>交付反馈</h3>
            <p>告知皮肤、毛结、耳道等观察结果，并给出下次护理周期。</p>
          </article>
        </div>
      </div>
    </section>

    <section class="environment" id="environment">
      <div class="section-inner">
        <div class="section-head">
          <h2>店内环境</h2>
          <p>参考高端宠物洗护店常见的 spa 化空间，把接待、洗护、造型和等待观察区分开，让宠物更少紧张，主人也能看得见细节。</p>
        </div>
        <div class="environment-shell" aria-label="店内环境轮播图">
          <div class="environment-view">
            <div class="environment-controls">
              <button class="icon-btn" type="button" id="environmentPrev" aria-label="上一张">‹</button>
              <button class="icon-btn" type="button" id="environmentNext" aria-label="下一张">›</button>
            </div>
            <article class="environment-slide active">
              <img src="/assets/environment-reception.png" alt="高端宠物洗护店接待与零售区">
              <div class="environment-caption">
                <h3>接待与精品区</h3>
                <p>温暖木色、干净陈列和舒适等候区，进店第一步先降低宠物紧张感。</p>
              </div>
            </article>
            <article class="environment-slide">
              <img src="/assets/environment-bath.png" alt="高端宠物洗护店专业洗护区">
              <div class="environment-caption">
                <h3>专业洗护区</h3>
                <p>符合宠物身高的洗护设备、独立清洁工具和明亮瓷砖，重点呈现卫生与安全。</p>
              </div>
            </article>
            <article class="environment-slide">
              <img src="/assets/environment-styling.png" alt="高端宠物洗护店造型修剪区">
              <div class="environment-caption">
                <h3>造型修剪区</h3>
                <p>稳定护理台、柔和任务灯和有序工具位，适合长毛、精修和局部造型。</p>
              </div>
            </article>
            <article class="environment-slide">
              <img src="/assets/environment-lounge.png" alt="高端宠物洗护店宠物休息观察区">
              <div class="environment-caption">
                <h3>休息观察区</h3>
                <p>透明观察、柔软垫面和通风细节，让洗护前后都能安静等待。</p>
              </div>
            </article>
          </div>
          <aside class="environment-panel" aria-label="环境分区列表">
            <div class="environment-list">
              <button class="environment-tab active" type="button" data-slide="0">
                <img src="/assets/environment-reception.png" alt="">
                <span><strong>接待与精品区</strong>柔和明亮的第一印象</span>
              </button>
              <button class="environment-tab" type="button" data-slide="1">
                <img src="/assets/environment-bath.png" alt="">
                <span><strong>专业洗护区</strong>清洁设备一目了然</span>
              </button>
              <button class="environment-tab" type="button" data-slide="2">
                <img src="/assets/environment-styling.png" alt="">
                <span><strong>造型修剪区</strong>细节护理更稳定</span>
              </button>
              <button class="environment-tab" type="button" data-slide="3">
                <img src="/assets/environment-lounge.png" alt="">
                <span><strong>休息观察区</strong>低压力等待空间</span>
              </button>
            </div>
            <div class="environment-dots" aria-label="轮播图分页">
              <button class="environment-dot active" type="button" data-slide="0" aria-label="第 1 张"></button>
              <button class="environment-dot" type="button" data-slide="1" aria-label="第 2 张"></button>
              <button class="environment-dot" type="button" data-slide="2" aria-label="第 3 张"></button>
              <button class="environment-dot" type="button" data-slide="3" aria-label="第 4 张"></button>
            </div>
          </aside>
        </div>
      </div>
    </section>

    <section class="pricing" id="pricing">
      <div class="section-inner">
        <div class="section-head">
          <h2>常用套餐</h2>
          <p>价格会根据体型、毛量、毛结和配合度微调，预约后可先做预估。</p>
        </div>
        <div class="price-grid">
          <article class="price-card">
            <div class="price-top">
              <div>
                <h3>清爽基础洗</h3>
                <div class="price">¥88 <small>起</small></div>
              </div>
            </div>
            <ul class="features">
              <li>温和清洁和吹干</li>
              <li>基础梳理</li>
              <li>适合短毛犬猫</li>
            </ul>
            <a class="btn secondary" href="#booking" data-plan="清爽基础洗">选择套餐</a>
          </article>
          <article class="price-card featured">
            <div class="price-top">
              <div>
                <h3>全套护理洗</h3>
                <div class="price">¥138 <small>起</small></div>
              </div>
              <span class="tag">推荐</span>
            </div>
            <ul class="features">
              <li>洗澡、吹干、梳理</li>
              <li>剪指甲、清耳、剃脚底毛</li>
              <li>适合多数日常护理</li>
            </ul>
            <a class="btn" href="#booking" data-plan="全套护理洗">选择套餐</a>
          </article>
          <article class="price-card">
            <div class="price-top">
              <div>
                <h3>造型精修</h3>
                <div class="price">¥228 <small>起</small></div>
              </div>
            </div>
            <ul class="features">
              <li>全套护理洗</li>
              <li>脸型、脚型和局部修剪</li>
              <li>适合贵宾、比熊、长毛猫</li>
            </ul>
            <a class="btn secondary" href="#booking" data-plan="造型精修">选择套餐</a>
          </article>
        </div>
      </div>
    </section>

    <section class="reviews" id="reviews">
      <div class="section-inner">
        <div class="section-head">
          <h2>真实主人更在意细节</h2>
          <p>我们把宠物的舒适度放在速度前面，也把可沟通、可追踪的护理结果交给主人。</p>
        </div>
        <div class="review-grid">
          <article class="review">
            <div>
              <div class="stars">★★★★★</div>
              <blockquote>我家狗胆子很小，以前洗澡会发抖。这次护理师一直慢慢安抚，回来后毛很蓬松，也没有刺鼻香味。</blockquote>
            </div>
            <div class="pet-owner">豆包主人 · 柯基</div>
          </article>
          <article class="review">
            <div>
              <div class="stars">★★★★★</div>
              <blockquote>长毛猫梳开了很多毛结，店里还提醒我耳后要每天梳，反馈很细。</blockquote>
            </div>
            <div class="pet-owner">糯米主人 · 布偶猫</div>
          </article>
          <article class="review">
            <div>
              <div class="stars">★★★★★</div>
              <blockquote>预约时间准，接送流程清楚。洗完拍照发给我，状态看起来很放松。</blockquote>
            </div>
            <div class="pet-owner">可乐主人 · 博美</div>
          </article>
        </div>
      </div>
    </section>

    <section class="booking" id="booking">
      <div class="section-inner booking-layout">
        <div class="booking-copy">
          <h2>预约前先告诉我们宠物情况</h2>
          <p>提交后我们会根据体型、毛量和服务项目给出时长与价格预估，再确认到店时间。</p>
          <div class="contact-list" aria-label="联系方式">
            <div class="contact-item"><span>电</span> 400-826-1024</div>
            <div class="contact-item"><span>时</span> 周一至周日 10:00-20:00</div>
            <div class="contact-item"><span>店</span> 南京雨花客厅5栋106室 · 可临停接宠</div>
          </div>
          <div class="store-map" aria-label="门店地图">
            <div class="map-canvas">
              <div class="map-road main-x"></div>
              <div class="map-road main-y"></div>
              <div class="map-road soft-x"></div>
              <div class="map-area one">雨花客厅<br>办公区</div>
              <div class="map-area two">商业配套<br>与停车区</div>
              <div class="map-area three">软件大道<br>沿街入口</div>
              <div class="store-pin" aria-label="茸净宠物洗护门店位置">
                <div class="pin-bubble">茸净宠物洗护</div>
                <div class="pin-dot"></div>
              </div>
            </div>
            <div class="map-info">
              <strong>南京雨花客厅5栋106室</strong>
              <span>南京市雨花台区软件大道109号雨花客厅，5栋 106 室。</span>
              <a class="map-link" href="https://uri.amap.com/search?keyword=%E5%8D%97%E4%BA%AC%E9%9B%A8%E8%8A%B1%E5%AE%A2%E5%8E%855%E6%A0%8B106%E5%AE%A4" target="_blank" rel="noreferrer">在高德地图打开</a>
            </div>
          </div>
        </div>
        <form class="booking-panel" id="bookingForm">
          <div class="form-grid">
            <label>
              主人称呼
              <input name="owner" autocomplete="name" placeholder="例如：林小姐" required>
            </label>
            <label>
              联系电话
              <input name="phone" inputmode="tel" autocomplete="tel" placeholder="用于确认预约" required>
            </label>
            <label>
              账号密码
              <input name="password" type="password" autocomplete="current-password" placeholder="首次预约自动建号" minlength="6" required>
            </label>
            <label>
              宠物类型
              <select name="petType" id="petType">
                <option value="dog">狗狗</option>
                <option value="cat">猫咪</option>
              </select>
            </label>
            <label>
              体型
              <select name="size" id="size">
                <option value="small">小型</option>
                <option value="medium">中型</option>
                <option value="large">大型</option>
              </select>
            </label>
            <label class="full">
              套餐
              <select name="plan" id="plan">
                <option value="清爽基础洗">清爽基础洗</option>
                <option value="全套护理洗" selected>全套护理洗</option>
                <option value="造型精修">造型精修</option>
              </select>
            </label>
            <label class="full">
              补充说明
              <textarea name="note" placeholder="例如：容易紧张、皮肤敏感、毛结位置、希望预约的时间"></textarea>
            </label>
          </div>
          <div class="estimate" id="estimate" aria-live="polite">预估：¥138 起，约 70-100 分钟</div>
          <button class="btn" type="submit">提交预约信息</button>
        </form>
      </div>
    </section>
  </main>

  <footer class="footer">
    <div class="footer-inner">
      <span>© 2026 茸净宠物洗护</span>
      <span>一宠一消毒 · 猫狗分区 · 低刺激洗护</span>
    </div>
  </footer>

`;

