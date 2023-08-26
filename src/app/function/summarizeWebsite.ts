// @ts-nocheck
const axios = require("axios");
import * as cheerio from "cheerio";

const websiteArticleClass = {
  "cnn.com": {
    class: "article__main",
  },
  "google.com": {
    id: "center_col",
  },
};
const targetClass = "article__main";
const targetId = "center_col";

export const summarizeWebsite = async ({ url }: { url: string }) => {
  try {
    const { data } = await axios.get(url);

    const extractTextFromElement = ($, element) => {
      let text = "";
      $(element)
        .contents()
        .each((_, el) => {
          if (el.type === "text") {
            text += $(el).text().trim();
          } else if (el.type === "tag") {
            text += extractTextFromElement($, el);
          }
        });
      return text;
    };

    const $ =
      cheerio.load(`<div class="layout__content-wrapper layout-with-rail__content-wrapper">
    <section class="layout__info layout-with-rail__info" data-editable="topLayout" data-track-zone="topLayout">  <div data-uri="cms.cnn.com/_components/alerts/instances/cnn-v1@published" class="alerts"></div>

<div data-uri="cms.cnn.com/_components/market-feature-ribbon/instances/business-with-ad-v1@published" class="market-feature-ribbon" id="marketFeatureRibbon" data-expanded="true">
  <div class="market-feature-ribbon__content">
    <div class="market-feature-ribbon__column">
      <div class="market-feature-ribbon__column-content" data-url="/markets">
        <p class="market-feature-ribbon__column-header">Markets <svg class="right-arrow" enable-background="new 0 0 492.004 492.004" version="1.1" viewBox="0 0 492.004 492.004" xml:space="preserve" xmlns="http://www.w3.org/2000/svg">
  <path d="m484.14 226.89l-177.68-177.68c-5.072-5.072-11.832-7.856-19.04-7.856-7.216 0-13.972 2.788-19.044 7.856l-16.132 16.136c-5.068 5.064-7.86 11.828-7.86 19.04 0 7.208 2.792 14.2 7.86 19.264l103.66 103.88h-329.32c-14.848 0-26.58 11.624-26.58 26.476v22.812c0 14.852 11.732 27.648 26.58 27.648h330.5l-104.83 104.46c-5.068 5.072-7.86 11.652-7.86 18.864 0 7.204 2.792 13.88 7.86 18.948l16.132 16.084c5.072 5.072 11.828 7.836 19.044 7.836 7.208 0 13.968-2.8 19.04-7.872l177.68-177.68c5.084-5.088 7.88-11.88 7.86-19.1 0.016-7.244-2.776-14.04-7.864-19.12z"></path>
</svg>
</p>
          <div data-uri="cms.cnn.com/_components/market-indices/instances/business-feature-ribbon@published" class="market-indices" data-interval="5000" data-link-url="">
<div class="market-indices__table market-indices__trend--open">
  
    <div class="market-indices__table-row market-indices__trend--down" id="market-indices__DJII-USA_row" data-symbol="DJII-USA" data-url="https://money.cnn.com/data/markets/dow">
        <span class="market-indices__table-cell"><span class="market-indices__ticker">DOW</span></span>
        <span class="market-indices__table-cell">34,463.69</span>
        <span class="market-indices__table-cell market-indices__trend-data">0.11%</span><span class="market-indices__trend-arrow"></span>
    </div>
    <div class="market-indices__table-row market-indices__trend--up" id="market-indices__SP500-CME_row" data-symbol="SP500-CME" data-url="https://money.cnn.com/data/markets/sandp">
        <span class="market-indices__table-cell"><span class="market-indices__ticker">S&amp;P 500</span></span>
        <span class="market-indices__table-cell">4,399.77</span>
        <span class="market-indices__table-cell market-indices__trend-data">0.69%</span><span class="market-indices__trend-arrow"></span>
    </div>
    <div class="market-indices__table-row market-indices__trend--up" id="market-indices__COMP-USA_row" data-symbol="COMP-USA" data-url="https://money.cnn.com/quote/quote.html?symb=COMP.IDX">
        <span class="market-indices__table-cell"><span class="market-indices__ticker">NASDAQ</span></span>
        <span class="market-indices__table-cell">13,497.59</span>
        <span class="market-indices__table-cell market-indices__trend-data">1.56%</span><span class="market-indices__trend-arrow"></span>
    </div>
</div>
</div>

      </div>
    </div>
    <div class="market-feature-ribbon__column" data-featured-item="true">
      <div class="market-feature-ribbon__column-content" data-editable="featuredItemSettings" data-url="/markets/fear-and-greed">
        <p class="market-feature-ribbon__column-header">Fear &amp; Greed Index <svg class="right-arrow" enable-background="new 0 0 492.004 492.004" version="1.1" viewBox="0 0 492.004 492.004" xml:space="preserve" xmlns="http://www.w3.org/2000/svg">
  <path d="m484.14 226.89l-177.68-177.68c-5.072-5.072-11.832-7.856-19.04-7.856-7.216 0-13.972 2.788-19.044 7.856l-16.132 16.136c-5.068 5.064-7.86 11.828-7.86 19.04 0 7.208 2.792 14.2 7.86 19.264l103.66 103.88h-329.32c-14.848 0-26.58 11.624-26.58 26.476v22.812c0 14.852 11.732 27.648 26.58 27.648h330.5l-104.83 104.46c-5.068 5.072-7.86 11.652-7.86 18.864 0 7.204 2.792 13.88 7.86 18.948l16.132 16.084c5.072 5.072 11.828 7.836 19.044 7.836 7.208 0 13.968-2.8 19.04-7.872l177.68-177.68c5.084-5.088 7.88-11.88 7.86-19.1 0.016-7.244-2.776-14.04-7.864-19.12z"></path>
</svg>
</p>
          <div class="market-feature-ribbon__column-2-story market-feature-ribbon__column-2-story--expanded">
            <div class="market-fng-gauge market-fng-gauge_mini" data-uri="cms.cnn.com/_components/market-fng-gauge/instances/markets-feature-ribbon@published" data-showhistorical="false" data-initial-fetch-delay="1.5" data-update-interval="10" data-stream-market-data="true">
    <span class="market-data-poller" data-uri="cms.cnn.com/_components/market-data-poller/instances/mini-fng-data-poller@published" data-update-interval="10" data-data-url="https://production.dataviz.cnn.io/index/fearandgreed/current" data-stream-market-data="true">
</span>


  <div class="market-fng-gauge__overview">
      <div class="market-fng-gauge__meter-container">
          <div class="market-fng-gauge__meter" data-index-label="neutral">
              <!-- dial ranges -->
              <div class="market-fng-gauge__dial">
                      <svg version="1.1" id="fear-and-greed-dial" class="market-fng-gauge__svg" xmlns="http://www.w3.org/2000/svg" x="0px" y="0px" viewBox="12 -17 70 50" aria-labelledby="market-fng-gauge__title" style="enable-background: new 12 -17 70 50">
                          <path class="dial-area" id="extreme-greed" fill-rule="evenodd" clip-rule="evenodd" d="M13.317.283.899 12.317A28.61 28.61 0 0 1 8.71 32H26C26 19.705 21.176 8.536 13.317.283Z" transform="translate(67)"></path>
                          <path class="dial-area" id="greed" fill-rule="evenodd" clip-rule="evenodd" d="M4.83 1.056.452 17.81A28.646 28.646 0 0 1 15.33 25.73l12.415-12.031C21.601 7.467 13.693 2.986 4.83 1.056Z" transform="translate(52, -14)"></path>
                          <path class="dial-area" id="neutral" fill-rule="evenodd" clip-rule="evenodd" d="M19.03 1.888A46.21 46.21 0 0 0 10 1a46.22 46.22 0 0 0-9.009.885l4.385 16.778a28.898 28.898 0 0 1 9.269.003l4.384-16.778Z" transform="translate(37, -15)"></path>
                          <path class="dial-area" id="fear" fill-rule="evenodd" clip-rule="evenodd" d="M24.19 1.052C15.318 2.979 7.402 7.464 1.252 13.697L13.67 25.73a28.641 28.641 0 0 1 14.899-7.923L24.189 1.052Z" transform="translate(13, -14)"></path>
                          <path class="dial-area" id="extreme-fear" fill-rule="evenodd" clip-rule="evenodd" d="m13.683.283 12.418 12.034A28.61 28.61 0 0 0 18.29 32H1C1 19.705 5.824 8.536 13.683.283Z"></path>
                      </svg>
              </div>

              <!-- dial hand needle -->
              <div class="market-fng-gauge__hand">
                  <svg class="market-fng-gauge__hand-svg" version="1.1" xmlns="http://www.w3.org/2000/svg" x="0px" y="0px" viewBox="0 0 10 124" style="transform: rotate(-7.54deg)" preserveAspectRatio="xMidYMid meet">
                      <path d="M5,0.2c-0.6,0-1.1,0.5-1.1,1.1L0.8,106.7c0,2.3-0.1,13.6,2.6,16.3c0.6,0.6,1.3,0.7,1.8,0.7l0,0c0.5,0,1.1-0.2,1.7-0.9c0.1-0.2,0.3-0.3,0.4-0.5c2.2-3.6,1.7-13.9,1.6-16L6.1,1.3C6.1,0.7,5.6,0.2,5,0.2"></path>
                  </svg>
              </div>

              <!-- dial hand base -->
              <div class="market-fng-gauge__hand-base"></div>

              <!-- dial hand number -->
              <div class="market-fng-gauge__dial-number">
                  <span class="market-fng-gauge__dial-number-value">46</span>
              </div>
          </div>
      </div>

      <a href="/business/markets/fear-and-greed/index.html?utm_source=business_ribbon">
      </a>

  </div>


      <a href="/markets/fear-and-greed?utm_source=business_ribbon" class="market-fng-gauge__text" data-index-label="neutral">
          <span class="market-fng-gauge__label">neutral</span> is driving the US market 
      </a>
</div>

          </div>
      </div>
    </div>
    <div class="market-feature-ribbon__column">
      <div class="market-feature-ribbon__column-content">
        <p class="market-feature-ribbon__column-header" data-url="/business/investing">
          Latest Market News <svg class="right-arrow" enable-background="new 0 0 492.004 492.004" version="1.1" viewBox="0 0 492.004 492.004" xml:space="preserve" xmlns="http://www.w3.org/2000/svg">
  <path d="m484.14 226.89l-177.68-177.68c-5.072-5.072-11.832-7.856-19.04-7.856-7.216 0-13.972 2.788-19.044 7.856l-16.132 16.136c-5.068 5.064-7.86 11.828-7.86 19.04 0 7.208 2.792 14.2 7.86 19.264l103.66 103.88h-329.32c-14.848 0-26.58 11.624-26.58 26.476v22.812c0 14.852 11.732 27.648 26.58 27.648h330.5l-104.83 104.46c-5.068 5.072-7.86 11.652-7.86 18.864 0 7.204 2.792 13.88 7.86 18.948l16.132 16.084c5.072 5.072 11.828 7.836 19.044 7.836 7.208 0 13.968-2.8 19.04-7.872l177.68-177.68c5.084-5.088 7.88-11.88 7.86-19.1 0.016-7.244-2.776-14.04-7.864-19.12z"></path>
</svg>
</p>
          


<div class="container container_list-headlines  " data-uri="cms.cnn.com/_components/container/instances/market-feature-ribbon-latestnews@published" data-selective-publishing="true" data-collapsed-text="">
  <div class="container__ads container_list-headlines__ads">
        </div>
      <div class="container__kicker" data-editable="kicker">
      </div>
  <div class="container_list-headlines__cards-wrapper">
    <div class="container__field-wrapper container_list-headlines__field-wrapper">
      <div class="container__field-links container_list-headlines__field-links" data-editable="cards">
              






<div data-uri="cms.cnn.com/_components/card/instances/market-feature-ribbon-latestnews_fill_1@published" data-created-updated-by="true" class="card container__item container__item--type-article container_list-headlines__item container_list-headlines__item--type-article " data-component-name="card" data-open-link="/2023/08/21/media/rich-men-north-of-richmond-reliable-sources/index.html" data-unselectable="true">
  
          <a href="/2023/08/21/media/rich-men-north-of-richmond-reliable-sources/index.html?utm_source=business_ribbon" class="container__link container_list-headlines__link" data-link-type="article">
              <div class="container__text container_list-headlines__text">
          <div class="container__headline container_list-headlines__headline">
                                          <span data-editable="headline">A virtually unknown conservative singer just rocketed to the top of the charts. Here’s why it won’t be the last time</span>
          </div>
      </div>
  </a>
</div>

              






<div data-uri="cms.cnn.com/_components/card/instances/market-feature-ribbon-latestnews_fill_2@published" data-created-updated-by="true" class="card container__item container__item--type-article container_list-headlines__item container_list-headlines__item--type-article " data-component-name="card" data-open-link="/2023/08/21/economy/china-economy-troubles-intl-hnk/index.html" data-unselectable="true">
  
          <a href="/2023/08/21/economy/china-economy-troubles-intl-hnk/index.html?utm_source=business_ribbon" class="container__link container_list-headlines__link" data-link-type="article">
              <div class="container__text container_list-headlines__text">
          <div class="container__headline container_list-headlines__headline">
                                          <span data-editable="headline">China’s economy is in trouble. Here’s what’s gone wrong</span>
          </div>
      </div>
  </a>
</div>

              






<div data-uri="cms.cnn.com/_components/card/instances/market-feature-ribbon-latestnews_fill_3@published" data-created-updated-by="true" class="card container__item container__item--type-article container_list-headlines__item container_list-headlines__item--type-article " data-component-name="card" data-open-link="/2023/08/21/business/sp-us-bank-downgrades/index.html" data-unselectable="true">
  
          <a href="/2023/08/21/business/sp-us-bank-downgrades/index.html?utm_source=business_ribbon" class="container__link container_list-headlines__link" data-link-type="article">
              <div class="container__text container_list-headlines__text">
          <div class="container__headline container_list-headlines__headline">
                                          <span data-editable="headline">S&amp;P downgrades five US banks following Moody’s lead</span>
          </div>
      </div>
  </a>
</div>

      </div>
    </div>
  </div>

</div>

      </div>
      <div class="market-feature-ribbon__error">
        <span>Something isn't loading properly. Please check back later.</span>
      </div>
    </div>
    <div class="market-feature-ribbon__column market-feature-ribbon__ad">
            <div class="ad-slot-top" data-unselectable="true" data-uri="cms.cnn.com/_components/ad-slot-top/instances/cnn-v1@published">
          <div data-uri="cms.cnn.com/_components/ad-slot/instances/cnn-v1-no-feedback@published" class="ad-slot" data-path="topLayout/market-feature-ribbon[0]/ads/ad-slot-top[0]/items" data-desktop-slot-id="ad_ns_atf_01" data-mobile-slot-id="ad_ns_atf_01" data-unselectable="true"><div id="ad_ns_atf_01" class="ad" style="display: none;"></div>
      <div class="ad-slot__feedback ad-feedback-link-container">
          <div class="ad-slot__ad-label"></div>
           
<div data-ad-type="DISPLAY" data-ad-identifier="ad_ns_atf_01" class="ad-feedback-link">
  <div class="ad-feedback-link__label">Ad Feedback</div>
</div>
          
      </div>
  </div>

  </div>

    </div>
  </div>
</div>


<div data-uri="cms.cnn.com/_components/series-banner/instances/cnn-v1@published" data-rendered="false" class="series-banner  series-banner__no-image"></div>


</section>
    <section class="layout__top layout-with-rail__top" data-editable="top" data-track-zone="top">  <div data-uri="cms.cnn.com/_components/headline/instances/headline-china-economy-troubles-intl-hnk_h_ba74c952f5f3ac3a094a726d0c92d828@published" class="headline headline--has-lowertext" data-component-name="headline" data-analytics-observe="on">
<div class="headline__wrapper">
  <div data-editable="settings"></div>
  <h1 data-editable="headlineText" class="headline__text inline-placeholder" id="maincontent">
    China’s economy is in trouble. Here’s what’s gone wrong
  </h1>

</div>
<div class="headline__footer">
  <div class="headline__sub-container">
      
    <div class="headline__sub-text">
          <div data-uri="cms.cnn.com/_components/byline/instances/byline_h_ba74c952f5f3ac3a094a726d0c92d828@published" class="byline" data-editable="settings">
      <div class="byline__images">
                  <a class="byline__image-link" href="https://www.cnn.com/profiles/laura-he">
                  <script>function imageLoadError(img) {
  const fallbackImage = '/media/sites/cnn/cnn-fallback-image.jpg';

  img.removeAttribute('onerror');
  img.src = fallbackImage;
  let element = img.previousElementSibling;

  while (element && element.tagName === 'SOURCE') {
    element.srcset = fallbackImage;
    element = element.previousElementSibling;
  }
}</script><img height="100" width="100" class="byline__image" src="https://media.cnn.com/api/v1/images/stellar/prod/200717084458-laura-he-headshot.jpg?c=16x9&amp;q=h_270,w_480,c_fill/c_thumb,g_face,w_100,h_100" alt="Laura He" onerror="imageLoadError(this)">
                  </a>
      </div>
      <div class="byline__names">
          Analysis by <a class="byline__link" href="https://www.cnn.com/profiles/laura-he"><span class="byline__name">Laura He</span></a>, CNN
      </div>
</div>

          <div class="timestamp" data-uri="cms.cnn.com/_components/timestamp/instances/timestamp-h_ba74c952f5f3ac3a094a726d0c92d828@published" data-editable="settings">
Updated
      11:42 PM EDT, Mon August 21, 2023
  </div>

    </div>
  </div>
      <div data-uri="cms.cnn.com/_components/social-share/instances/h_ba74c952f5f3ac3a094a726d0c92d828@published" class="social-share">
  <div class="social-share__share-links" data-type="share-links">
      <button class="social-share__share" data-url="https://www.facebook.com/dialog/share?app_id=80401312489&amp;href=https%3A%2F%2Fwww.cnn.com%2F2023%2F08%2F21%2Feconomy%2Fchina-economy-troubles-intl-hnk&amp;display=popup" data-type="facebook" aria-label="share with facebook" title="Share with Facebook">
          <svg class="icon-social-facebook" width="24" height="24" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="M20.897 2H3.104C2.494 2 2 2.495 2 3.103v17.794C2 21.507 2.495 22 3.104 22h9.58v-7.744h-2.609v-3.02h2.607V9.01c0-2.585 1.578-3.992 3.883-3.992 1.104 0 2.194.083 2.47.12v2.797h-1.74c-1.252 0-1.506.596-1.506 1.47v1.832h2.999l-.388 3.019h-2.611V22h5.107c.61 0 1.104-.494 1.104-1.103V3.103C22 2.495 21.507 2 20.897 2"></path></svg>

      </button>
      <button class="social-share__share" data-url="https://twitter.com/intent/tweet?text=Check%20out%20this%20article%3A&amp;url=https%3A%2F%2Fwww.cnn.com%2F2023%2F08%2F21%2Feconomy%2Fchina-economy-troubles-intl-hnk" data-type="twitter" aria-label="share with twitter" title="Share with Twitter">
          <svg class="icon-social-twitter" width="24" height="24" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="M22 5.86a8.435 8.435 0 01-2.357.625 4.007 4.007 0 001.805-2.195 8.396 8.396 0 01-2.606.963A4.164 4.164 0 0015.847 4c-2.266 0-4.103 1.776-4.103 3.967 0 .311.036.614.106.904-3.41-.165-6.434-1.745-8.458-4.145a3.852 3.852 0 00-.555 1.994c0 1.377.724 2.591 1.825 3.303a4.191 4.191 0 01-1.858-.497v.05c0 1.922 1.414 3.525 3.29 3.89a4.239 4.239 0 01-1.852.068c.522 1.576 2.037 2.723 3.833 2.755a8.41 8.41 0 01-5.096 1.698c-.332 0-.658-.018-.979-.055a11.904 11.904 0 006.29 1.782c7.547 0 11.674-6.045 11.674-11.287 0-.172-.004-.343-.011-.513A8.183 8.183 0 0022 5.86"></path></svg>

      </button>
      <a class="social-share__share" href="mailto:?subject=CNN%20content%20share&amp;body=Check%20out%20this%20article%3A%0Ahttps%3A%2F%2Fwww.cnn.com%2F2023%2F08%2F21%2Feconomy%2Fchina-economy-troubles-intl-hnk" data-type="email" target="_blank" rel="noopener noreferrer" aria-label="share with email" title="Share with email">
          <svg class="icon-social-email-fill" width="24" height="24" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="M2 19.286v-8.25l9.536 3.441c.314.114.655.114.97 0L22 11.051v8.235c0 .394-.304.714-.672.714H2.667C2.299 20 2 19.68 2 19.286zM21.335 5c.368 0 .665.32.665.714v2.37c0 .72-.423 1.36-1.052 1.586l-8.927 3.222-8.967-3.236C2.424 9.43 2 8.79 2 8.07V5.714C2 5.32 2.299 5 2.667 5h18.668z"></path></svg>

      </a>
      <button class="social-share__share" data-url="https://www.cnn.com/2023/08/21/economy/china-economy-troubles-intl-hnk" data-type="copy" aria-label="copy link to clipboard" title="Copy link to clipboard">
          <svg class="icon-ui-link" width="24" height="24" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="M17.88 13.143h-1.57c0-2.363-1.831-4.286-4.084-4.286H9.508c.46-.852 1.318-1.428 2.3-1.428h6.073c1.466 0 2.66 1.281 2.66 2.857 0 1.575-1.194 2.857-2.66 2.857m-8.733-2.857h3.044c1.467 0 2.66 1.282 2.66 2.857h-3.044c-1.467 0-2.66-1.282-2.66-2.857M12.192 16H6.119c-1.467 0-2.66-1.282-2.66-2.857 0-1.575 1.193-2.857 2.66-2.857h1.57c0 2.363 1.832 4.285 4.084 4.285h2.72c-.462.853-1.32 1.429-2.301 1.429m5.724-10h-6.143C10 6 8.49 7.195 7.927 8.857H6.084C3.832 8.857 2 10.78 2 13.143c0 2.363 1.832 4.286 4.084 4.286h6.142c1.775 0 3.284-1.196 3.847-2.858h1.843c2.252 0 4.084-1.922 4.084-4.285C22 7.923 20.168 6 17.916 6"></path></svg>

      </button>
      <div class="social-share__copied" data-type="message">
          <svg class="icon-ui-check-mark" width="24" height="24" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="M8.556 19.286h-.024a1.152 1.152 0 01-.823-.361L2.264 13.02c-.397-.43-.34-1.076.128-1.442.47-.366 1.17-.313 1.568.118l4.633 5.024L20.072 5.327a1.183 1.183 0 011.572-.055.967.967 0 01.06 1.446L9.371 18.958a1.16 1.16 0 01-.816.328"></path></svg>

          Link Copied!
      </div>
  </div>
  <button class="social-share__open" data-type="open" aria-label="open social share" title="Open social share">
      <svg class="icon-ui-share-os" width="24" height="24" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="M19 12c.394 0 .714.32.714.714v8.572c0 .394-.32.714-.714.714H4.714A.715.715 0 014 21.286v-8.572a.715.715 0 011.429 0v7.857h12.857v-7.857c0-.394.32-.714.714-.714zm-7.664-9.79a.73.73 0 011.024 0l.076.075 4.916 4.854c.183.18.27.449.188.69a.734.734 0 01-1.216.314L12.57 4.5v11.786c0 .357-.357.714-.714.714s-.714-.359-.714-.714V4.5L7.372 8.143a.73.73 0 01-1.102-.091c-.21-.289-.149-.694.106-.946l4.884-4.821z"></path></svg>

  </button>
  <button class="social-share__close" data-type="close" aria-label="close social share" title="Close social share">
      <svg class="icon-ui-close" width="24" height="24" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="M19.787 18.758l-6.792-6.781 6.746-6.735a.728.728 0 00-1.028-1.03l-6.747 6.737-6.711-6.7a.728.728 0 00-1.028 1.03l6.71 6.698-6.723 6.712a.727.727 0 101.027 1.03l6.725-6.714 6.793 6.782a.725.725 0 001.028 0 .727.727 0 000-1.03"></path></svg>

  </button>
</div>

</div>
</div>

  <div class="ad-slot-top" data-unselectable="true" data-uri="cms.cnn.com/_components/ad-slot-top/instances/cnn-v1@published">
          <div data-uri="cms.cnn.com/_components/ad-slot/instances/cnn-v1-no-feedback@published" class="ad-slot" data-path="topLayout/market-feature-ribbon[0]/ads/ad-slot-top[0]/items" data-desktop-slot-id="ad_ns_atf_01" data-mobile-slot-id="ad_ns_atf_01" data-unselectable="true"><div id="ad_ns_atf_01" class="ad"></div>
      <div class="ad-slot__feedback ad-feedback-link-container">
          <div class="ad-slot__ad-label"></div>
           
<div data-ad-type="DISPLAY" data-ad-identifier="ad_ns_atf_01" class="ad-feedback-link">
  <div class="ad-feedback-link__label">Ad Feedback</div>
</div>
          
      </div>
  </div>

  </div>

</section>
    
    <section class="layout__wrapper layout-with-rail__wrapper" data-sticky-anchor-pos="top" data-sticky-anchor-condition-type="pageType" data-sticky-anchor-condition-value="article" data-sticky-anchor-priority="1">
      <section class="layout__main-wrapper layout-with-rail__main-wrapper">
        <section class="layout__main layout-with-rail__main" data-editable="main" data-track-zone="main" data-reorderable="main">  <article data-uri="cms.cnn.com/_components/article/instances/h_ba74c952f5f3ac3a094a726d0c92d828@published" class="article" role="main" data-unselectable="true"><div class="scroll-depth-observer scroll-100" style="top: 4277px; position: relative; width: 100%; left: 0px;"></div><div class="scroll-depth-observer scroll-75" style="top: 3207.75px; position: relative; width: 100%; left: 0px;"></div><div class="scroll-depth-observer scroll-50" style="top: 2138.5px; position: relative; width: 100%; left: 0px;"></div><div class="scroll-depth-observer scroll-25" style="top: 1069.25px; position: relative; width: 100%; left: 0px;"></div>
    <script>
        window.CNN.contentModel.leadingMediaType = 'video';
        window.CNN.contentModel.isVideoCollection = true;
    </script>
<section class="body tabcontent active" data-tabcontent="Content">
  <main class="article__main">
              <div class="image__lede article__lede-wrapper" data-editable="lede" data-freewheel-lede="true">
                          
      
      

<div data-uri="cms.cnn.com/_components/video-inline/instances/h_8a01825b2fe5267c6277dcac7d3552d4-h_ba74c952f5f3ac3a094a726d0c92d828-pageTop@published" class="video-inline_carousel">
  <div class="video-inline_carousel__wrapper">
      <div data-editable="featuredVideo" class="video-inline_carousel__video-resource">
          
  
  

<div data-uri="cms.cnn.com/_components/video-resource/instances/h_8a01825b2fe5267c6277dcac7d3552d4-h_ba74c952f5f3ac3a094a726d0c92d828-pageTop@published" data-component-name="video-resource" data-editable="settings" class="video-resource" data-video-id="business/2023/08/18/china-economy-impact-rest-of-the-world-simon-baptist-sot-ovn-hnk-vpx.cnn" data-live="" data-analytics-aggregate-events="true" data-custom-experience="" data-asset-type="" data-medium-env="prod" data-autostart="false" data-show-ads="true" data-source="CNN" data-featured-video="true" data-headline="Hear how China's economic slowdown could hurt and benefit other countries" data-description="Simon Baptist, Chief Economist of the Economist Intelligence Unit, joins CNN's Michael Holmes to discuss how China's economic slowdown could impact the rest of the world. " data-duration="01:27" data-source-html="<span class=&quot;video-resource__source&quot;> - Source:
              <a href=&quot;https://www.cnn.com/&quot; class=&quot;video-resource__source-url&quot;>CNN</a>
  </span>" data-fave-thumbnails="{&quot;big&quot;: { &quot;uri&quot;: &quot;https://media.cnn.com/api/v1/images/stellar/prod/230818135614-screengrab-simon-baptist.jpg?c=16x9&amp;q=h_540,w_960,c_fill&quot; }, &quot;small&quot;: { &quot;uri&quot;: &quot;https://media.cnn.com/api/v1/images/stellar/prod/230818135614-screengrab-simon-baptist.jpg?c=16x9&amp;q=h_540,w_960,c_fill&quot; }  }" data-vr-video="" data-show-html="<!-- unable to render partial show without a supplied context -->" data-check-event-based-preview="" data-network-id="" data-details="">
          <div id="player-cms.cnn.com/_components/video-resource/instances/h_8a01825b2fe5267c6277dcac7d3552d4-h_ba74c952f5f3ac3a094a726d0c92d828-pageTop@published" class="video-resource__wrapper"><div class="fave-player-container fave-top-player fave-no-mobile" id="player-player-cms.cnn.com/_components/video-resource/instances/h_8a01825b2fe5267c6277dcac7d3552d4-h_ba74c952f5f3ac3a094a726d0c92d828-pageTop@published" ref="undefined"><div id="player-player-cms.cnn.com/_components/video-resource/instances/h_8a01825b2fe5267c6277dcac7d3552d4-h_ba74c952f5f3ac3a094a726d0c92d828-pageTop@published-pui-wrapper" class="pui-wrapper"><div class="sc-gzVnrw pui sc-kkGfuU cmYsCe" style="pointer-events: auto;"><div class="sc-gzVnrw pui_unplayed-slate sc-eHgmQL bphWhp" title="Play"><button class="pui_center-controls_big-play-toggle sc-iAyFgw cnBpEa"><svg class="play-icon" width="64" height="64" viewBox="0 0 64 64" fill="" xmlns="https://www.w3.org/2000/svg" aria-labelledby="playIconTitle" role="img" style="outline: 0px;"><title id="playIconTitle">Play</title><path d="M19.15 55.34l30.07-20a4 4 0 0 0 0-6.66l-30.07-20A4 4 0 0 0 13 12.07v39.86a4 4 0 0 0 6.15 3.41z"></path></svg></button></div></div></div><div id="top-container-1" class="top-container" role="region" aria-label="video player" style="width: 100%; height: 100%; position: relative; z-index: 0;"><div id="top-player-container-1" class="top-player-container" style="height: 100%; width: 100%; position: relative;"><video class="top-player-video-element" poster="https://media.cnn.com/api/v1/images/stellar/prod/230818135614-screengrab-simon-baptist.jpg?c=16x9&amp;q=h_540,w_960,c_fill"></video></div><div class="tui"><div class="tui__control-surface tui__control-surface--control-bar-visible" role="none" style="width: 100%; height: 100%; cursor: default; pointer-events: auto;"><div class="tui__slate" style="z-index: 0;"><div class="tui-slate__container" role="none" style="display: none;"><div class="tui-clickthrough-overlay tui-clickthrough-overlay__disabled" role="link"></div></div><div class="tui-slate__container" role="none" style="display: none;"><div class="tui-media-slate" role="none" tabindex="-1" style="padding-bottom: 0px;"><div class="tui-cc__container"><div class="tui-cc__cue-surface" tabindex="-1"></div></div></div></div></div><div class="tui-control-bar" role="none"><div class="tui-control-bar__controls--top" style="top: 0px;"><div class="tui-controls__top-bar"><div class="tui-controls__left"></div><div class="tui-controls__right"></div></div></div><div class="tui-control-bar__controls--center"><div class="tui-controls__center-bar"><div class="tui-controls__center"></div></div></div><div class="tui-control-bar__controls" style="bottom: 0px;"><div class="tui-controls__progress-bar"></div><div class="tui-controls__bottom-bar"><div class="tui-controls__left"></div><div class="tui-controls__right"></div></div></div><div class="tui-control-bar__background" style="bottom: 0px;"></div></div></div></div></div></div></div>
          <div class="ad-feedback-link-container">
              
<div data-ad-type="VIDEO" data-ad-identifier="1861eed9-d366-4d5d-97a2-b387c272c407" class="ad-feedback-link">
  <div class="ad-feedback-link__label">Video Ad Feedback</div>
</div>
          </div>
          <div class="video-resource__details">
              <div data-editable="headline" class="video-resource__headline">Hear how China's economic slowdown could hurt and benefit other countries</div>
              <div class="video-resource__credit">
                      <span class="video-resource__duration">
                          01:27
                      </span>
                      <span class="video-resource__source"> - Source:
              <a href="https://www.cnn.com/" class="video-resource__source-url">CNN</a>
  </span>
              </div>
          </div>
      </div>

      </div>
        <div data-uri="cms.cnn.com/_components/video-playlist/instances/h_064a8f1e60a7f998d33c486251fcbafe-h_ba74c952f5f3ac3a094a726d0c92d828@published" class="video-playlist" data-items-layout="list" data-component-name="video-playlist" data-editable="settings">
<div class="video-playlist__playlist-wrapper">
  <div class="video-playlist__playlist-info">
    <span class="video-playlist__info-headline inline-placeholder" data-editable="headline">World News</span>
    <span class="video-playlist__count">15 videos</span>
  </div>
  <div class="video-playlist__outer-container">
    <div class="video-playlist__items-container" data-editable="videos" data-reorderable-component="videos" style="transform: translate3d(-1136px, 0px, 0px); width: 6532px;">
              
              
  
  

<div data-uri="cms.cnn.com/_components/video-resource/instances/h_4b12d74c0710d08388ee84ea6d1873e9-h_064a8f1e60a7f998d33c486251fcbafe@published" data-component-name="video-resource" data-editable="settings" class="video-resource" data-index="idx-11" data-canonical-url-path="/videos/world/2023/08/10/americans-released-from-iranian-prison-house-arrest-deal-amanpour-nc-vpx.cnn" data-video-instance="cms.cnn.com/_components/video-resource/instances/h_4b12d74c0710d08388ee84ea6d1873e9-h_064a8f1e60a7f998d33c486251fcbafe@published" data-video-id="world/2023/08/10/americans-released-from-iranian-prison-house-arrest-deal-amanpour-nc-vpx.cnn" data-live="" data-headline="CNN chief international anchor details deal with Iran that includes release of 5 Americans" data-description="CNN chief international anchor Christiane Amanpour details <a href=&quot;https://www.cnn.com/2023/08/10/politics/americans-released-from-iranian-prison-house-arrest/index.html&quot;>a deal between the United States and Iran</a> that includes the release of five Americans imprisoned in Iran and making $6 billion in frozen Iranian funds more accessible to Tehran in exchange for their return to the US." data-duration="02:00" data-source-html="<span class=&quot;video-resource__source&quot;> - Source:
              <a href=&quot;https://www.cnn.com/&quot; class=&quot;video-resource__source-url&quot;>CNN</a>
  </span>" data-fave-thumbnails="{&quot;big&quot;: { &quot;uri&quot;: &quot;https://media.cnn.com/api/v1/images/stellar/prod/230810121506-americans-wrongfully-detained-iran-split.jpg?c=16x9&amp;q=h_540,w_960,c_fill&quot; }, &quot;small&quot;: { &quot;uri&quot;: &quot;https://media.cnn.com/api/v1/images/stellar/prod/230810121506-americans-wrongfully-detained-iran-split.jpg?c=16x9&amp;q=h_540,w_960,c_fill&quot; }  }" data-vr-video="" data-show-html="<!-- unable to render partial show without a supplied context -->" data-check-event-based-preview="" data-network-id="" data-details="" data-position="0">
          <div>
              <div class="video-resource__image">
                      <div data-uri="cms.cnn.com/_components/image/instances/thumbnail-image-33261be79ab51490f449c41334faa8ec@published" class="image image__hide-placeholder" data-image-variation="image" data-name="americans wrongfully detained iran SPLIT" data-component-name="image" data-observe-resizes="" data-breakpoints="{&quot;image--eq-extra-small&quot;: 115, &quot;image--eq-small&quot;: 300}" data-original-ratio="0.5625" data-original-height="900" data-original-width="1600" data-url="https://media.cnn.com/api/v1/images/stellar/prod/230810121506-americans-wrongfully-detained-iran-split.jpg?c=original" data-unselectable="true">
    
  <div class="image__container " data-image-variation="image" data-breakpoints="{&quot;image--eq-extra-small&quot;: 115, &quot;image--eq-small&quot;: 300, &quot;image--show-credits&quot;: 596}">
     <picture class="image__picture"><img src="https://media.cnn.com/api/v1/images/stellar/prod/230810121506-americans-wrongfully-detained-iran-split.jpg?c=16x9&amp;q=w_250,c_fill" alt="Siamak Namazi, Emad Shargi and Morad Tahbaz" class="image__dam-img image__dam-img--loading" onload="this.classList.remove('image__dam-img--loading')" onerror="imageLoadError(this)" height="900" width="1600" loading="lazy"></picture>
  </div>
  <div class="image__metadata"></div>
  
</div>

              </div>
          </div>
          <div class="ad-feedback-link-container">
              
<div data-ad-type="VIDEO" data-ad-identifier="" class="ad-feedback-link">
  <div class="ad-feedback-link__label">Video Ad Feedback</div>
</div>
          </div>
          <div class="video-resource__details">
              <div data-editable="headline" class="video-resource__headline">CNN chief international anchor details deal with Iran that includes release of 5 Americans</div>
              <div class="video-resource__credit">
                      <span class="video-resource__duration">
                            <svg class="icon-sig-video" width="24" height="24" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="M12 3.333c-4.779 0-8.667 3.888-8.667 8.667S7.221 20.667 12 20.667s8.667-3.888 8.667-8.667S16.779 3.333 12 3.333M12 22C6.486 22 2 17.514 2 12S6.486 2 12 2s10 4.486 10 10-4.486 10-10 10m-1.064-6.793l4.61-2.74a.715.715 0 00-.003-1.23l-4.61-2.712a.714.714 0 00-1.076.616v5.452c0 .554.603.897 1.08.614"></path></svg>

                          02:00
                      </span>
                      <div class="video-resource__label-status">
                          Now playing
                      </div>
                      <span class="video-resource__source"> - Source:
              <a href="https://www.cnn.com/" class="video-resource__source-url">CNN</a>
  </span>
              </div>
          </div>
      </div><div data-uri="cms.cnn.com/_components/video-resource/instances/h_87010354ffa52527e91791cc63aecbfe-h_064a8f1e60a7f998d33c486251fcbafe@published" data-component-name="video-resource" data-editable="settings" class="video-resource" data-index="idx-12" data-canonical-url-path="/videos/world/2023/08/11/china-flooding-protest-watson-pkg-ebof-vpx.cnn" data-video-instance="cms.cnn.com/_components/video-resource/instances/h_87010354ffa52527e91791cc63aecbfe-h_064a8f1e60a7f998d33c486251fcbafe@published" data-video-id="world/2023/08/11/china-flooding-protest-watson-pkg-ebof-vpx.cnn" data-live="" data-headline="CNN's signal cut in China during flooding report" data-description="CNN's Ivan Watson breaks down the rare protests that erupted in China after flood waters were diverted from Beijing into neighboring provinces." data-duration="03:54" data-source-html="<span class=&quot;video-resource__source&quot;> - Source:
              <a href=&quot;https://www.cnn.com/&quot; class=&quot;video-resource__source-url&quot;>CNN</a>
  </span>" data-fave-thumbnails="{&quot;big&quot;: { &quot;uri&quot;: &quot;https://media.cnn.com/api/v1/images/stellar/prod/230802160130-02-beijing-flooding.jpg?c=16x9&amp;q=h_540,w_960,c_fill&quot; }, &quot;small&quot;: { &quot;uri&quot;: &quot;https://media.cnn.com/api/v1/images/stellar/prod/230802160130-02-beijing-flooding.jpg?c=16x9&amp;q=h_540,w_960,c_fill&quot; }  }" data-vr-video="" data-show-html="<a data-uri=&quot;cms.cnn.com/_components/show/instances/show_4E71F009-862D-73F6-CD76-6FE946F4C52F@published&quot; href=&quot;https://www.cnn.com/shows/erin-burnett-out-front&quot; class=&quot;show show__showlink-url&quot;> Erin Burnett Out Front
  </a>" data-check-event-based-preview="" data-network-id="" data-details="" data-position="1">
          <div>
              <div class="video-resource__image">
                      <div data-uri="cms.cnn.com/_components/image/instances/thumbnail-image-beeb21113b32820daf50bc8918c526a8@published" class="image image__hide-placeholder" data-image-variation="image" data-name="02 beijing flooding" data-component-name="image" data-observe-resizes="" data-breakpoints="{&quot;image--eq-extra-small&quot;: 115, &quot;image--eq-small&quot;: 300}" data-original-ratio="0.6665" data-original-height="1333" data-original-width="2000" data-url="https://media.cnn.com/api/v1/images/stellar/prod/230802160130-02-beijing-flooding.jpg?c=original" data-unselectable="true">
    
  <div class="image__container " data-image-variation="image" data-breakpoints="{&quot;image--eq-extra-small&quot;: 115, &quot;image--eq-small&quot;: 300, &quot;image--show-credits&quot;: 596}">
     <picture class="image__picture"><img src="https://media.cnn.com/api/v1/images/stellar/prod/230802160130-02-beijing-flooding.jpg?c=16x9&amp;q=w_250,c_fill" alt="Residents evacuate on rubber boats through floodwaters in Zhuozhou in northern China's Hebei province, south of Beijing, Wednesday, Aug. 2, 2023. China's capital has recorded its heaviest rainfall in at least 140 years over the past few days. Among the hardest hit areas is Zhuozhou, a small city that borders Beijing's southwest. (AP Photo/Andy Wong)" class="image__dam-img image__dam-img--loading" onload="this.classList.remove('image__dam-img--loading')" onerror="imageLoadError(this)" height="1333" width="2000" loading="lazy"></picture>
  </div>
  <div class="image__metadata"></div>
  
</div>

              </div>
          </div>
          <div class="ad-feedback-link-container">
              
<div data-ad-type="VIDEO" data-ad-identifier="" class="ad-feedback-link">
  <div class="ad-feedback-link__label">Video Ad Feedback</div>
</div>
          </div>
          <div class="video-resource__details">
              <div data-editable="headline" class="video-resource__headline">CNN's signal cut in China during flooding report</div>
              <div class="video-resource__credit">
                      <span class="video-resource__duration">
                            <svg class="icon-sig-video" width="24" height="24" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="M12 3.333c-4.779 0-8.667 3.888-8.667 8.667S7.221 20.667 12 20.667s8.667-3.888 8.667-8.667S16.779 3.333 12 3.333M12 22C6.486 22 2 17.514 2 12S6.486 2 12 2s10 4.486 10 10-4.486 10-10 10m-1.064-6.793l4.61-2.74a.715.715 0 00-.003-1.23l-4.61-2.712a.714.714 0 00-1.076.616v5.452c0 .554.603.897 1.08.614"></path></svg>

                          03:54
                      </span>
                      <div class="video-resource__label-status">
                          Now playing
                      </div>
                      <span class="video-resource__source"> - Source:
              <a href="https://www.cnn.com/" class="video-resource__source-url">CNN</a>
  </span>
              </div>
          </div>
      </div><div data-uri="cms.cnn.com/_components/video-resource/instances/h_34f5d83738560c3b8ba818f500a6aeff-h_064a8f1e60a7f998d33c486251fcbafe@published" data-component-name="video-resource" data-editable="settings" class="video-resource" data-index="idx-13" data-canonical-url-path="/videos/world/2023/08/10/norway-flooding-home-destroyed-lon-orig-ao.cnn" data-video-instance="cms.cnn.com/_components/video-resource/instances/h_34f5d83738560c3b8ba818f500a6aeff-h_064a8f1e60a7f998d33c486251fcbafe@published" data-video-id="world/2023/08/10/norway-flooding-home-destroyed-lon-orig-ao.cnn" data-live="" data-headline="See mobile home crushed under bridge in Norway floodwaters" data-description="Storm Hans brought extremely heavy rainfall to southern Norway, the region's strongest event in decades." data-duration="00:40" data-source-html="<span class=&quot;video-resource__source&quot;> - Source:
              <a href=&quot;https://www.cnn.com/&quot; class=&quot;video-resource__source-url&quot;>CNN</a>
  </span>" data-fave-thumbnails="{&quot;big&quot;: { &quot;uri&quot;: &quot;https://media.cnn.com/api/v1/images/stellar/prod/230810150746-norway-mobile-home.jpg?c=16x9&amp;q=h_540,w_960,c_fill&quot; }, &quot;small&quot;: { &quot;uri&quot;: &quot;https://media.cnn.com/api/v1/images/stellar/prod/230810150746-norway-mobile-home.jpg?c=16x9&amp;q=h_540,w_960,c_fill&quot; }  }" data-vr-video="" data-show-html="<!-- unable to render partial show without a supplied context -->" data-check-event-based-preview="" data-network-id="" data-details="" data-position="2">
          <div>
              <div class="video-resource__image">
                      <div data-uri="cms.cnn.com/_components/image/instances/thumbnail-image-ab4b8cf78e863c3376cf54f072894824@published" class="image image__hide-placeholder" data-image-variation="image" data-name="norway mobile home" data-component-name="image" data-observe-resizes="" data-breakpoints="{&quot;image--eq-extra-small&quot;: 115, &quot;image--eq-small&quot;: 300}" data-original-ratio="0.5625" data-original-height="1080" data-original-width="1920" data-url="https://media.cnn.com/api/v1/images/stellar/prod/230810150746-norway-mobile-home.jpg?c=original" data-unselectable="true">
    
  <div class="image__container " data-image-variation="image" data-breakpoints="{&quot;image--eq-extra-small&quot;: 115, &quot;image--eq-small&quot;: 300, &quot;image--show-credits&quot;: 596}">
     <picture class="image__picture"><img src="https://media.cnn.com/api/v1/images/stellar/prod/230810150746-norway-mobile-home.jpg?c=16x9&amp;q=w_250,c_fill" alt="norway mobile home" class="image__dam-img image__dam-img--loading" onload="this.classList.remove('image__dam-img--loading')" onerror="imageLoadError(this)" height="1080" width="1920" loading="lazy"></picture>
  </div>
  <div class="image__metadata"></div>
  
</div>

              </div>
          </div>
          <div class="ad-feedback-link-container">
              
<div data-ad-type="VIDEO" data-ad-identifier="" class="ad-feedback-link">
  <div class="ad-feedback-link__label">Video Ad Feedback</div>
</div>
          </div>
          <div class="video-resource__details">
              <div data-editable="headline" class="video-resource__headline">See mobile home crushed under bridge in Norway floodwaters</div>
              <div class="video-resource__credit">
                      <span class="video-resource__duration">
                            <svg class="icon-sig-video" width="24" height="24" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="M12 3.333c-4.779 0-8.667 3.888-8.667 8.667S7.221 20.667 12 20.667s8.667-3.888 8.667-8.667S16.779 3.333 12 3.333M12 22C6.486 22 2 17.514 2 12S6.486 2 12 2s10 4.486 10 10-4.486 10-10 10m-1.064-6.793l4.61-2.74a.715.715 0 00-.003-1.23l-4.61-2.712a.714.714 0 00-1.076.616v5.452c0 .554.603.897 1.08.614"></path></svg>

                          00:40
                      </span>
                      <div class="video-resource__label-status">
                          Now playing
                      </div>
                      <span class="video-resource__source"> - Source:
              <a href="https://www.cnn.com/" class="video-resource__source-url">CNN</a>
  </span>
              </div>
          </div>
      </div><div data-uri="cms.cnn.com/_components/video-resource/instances/h_70c231a66e65172c9e4968500b4ae24a-h_064a8f1e60a7f998d33c486251fcbafe@published" data-component-name="video-resource" data-editable="settings" class="video-resource" data-index="idx-14" data-canonical-url-path="/videos/world/2023/08/10/ecuador-assassination-fernando-villavicencio-cpt-hnk-vpx.cnn" data-video-instance="cms.cnn.com/_components/video-resource/instances/h_70c231a66e65172c9e4968500b4ae24a-h_064a8f1e60a7f998d33c486251fcbafe@published" data-video-id="world/2023/08/10/ecuador-assassination-fernando-villavicencio-cpt-hnk-vpx.cnn" data-live="" data-headline="Video appears to show moment of the assassination of Ecuador's presidential candidate" data-description="Fernando Villavicencio, an opposition candidate in Ecuador's upcoming Presidential election, <a href=&quot;https://edition.cnn.com/2023/08/09/americas/ecuador-presidential-candidate-fernando-villavicencio-assassinated-intl-hnk/index.html&quot; target=&quot;_blank&quot;>was assassinated</a> at a campaign event, according to Ecuador's President Guillermo Lasso. " data-duration="00:46" data-source-html="<span class=&quot;video-resource__source&quot;> - Source:
              <a href=&quot;https://www.cnn.com/&quot; class=&quot;video-resource__source-url&quot;>CNN</a>
  </span>" data-fave-thumbnails="{&quot;big&quot;: { &quot;uri&quot;: &quot;https://media.cnn.com/api/v1/images/stellar/prod/230809175301-fernando-villavicencio-aug-8.jpg?c=16x9&amp;q=h_540,w_960,c_fill&quot; }, &quot;small&quot;: { &quot;uri&quot;: &quot;https://media.cnn.com/api/v1/images/stellar/prod/230809175301-fernando-villavicencio-aug-8.jpg?c=16x9&amp;q=h_540,w_960,c_fill&quot; }  }" data-vr-video="" data-show-html="<!-- unable to render partial show without a supplied context -->" data-check-event-based-preview="" data-network-id="" data-details="" data-position="3">
          <div>
              <div class="video-resource__image">
                      <div data-uri="cms.cnn.com/_components/image/instances/thumbnail-image-ec346ccca4dc87da7479ad64af6be35b@published" class="image image__hide-placeholder" data-image-variation="image" data-name="Fernando Villavicencio aug 8" data-component-name="image" data-observe-resizes="" data-breakpoints="{&quot;image--eq-extra-small&quot;: 115, &quot;image--eq-small&quot;: 300}" data-original-ratio="0.5625" data-original-height="900" data-original-width="1600" data-url="https://media.cnn.com/api/v1/images/stellar/prod/230809175301-fernando-villavicencio-aug-8.jpg?c=original" data-unselectable="true">
    
  <div class="image__container " data-image-variation="image" data-breakpoints="{&quot;image--eq-extra-small&quot;: 115, &quot;image--eq-small&quot;: 300, &quot;image--show-credits&quot;: 596}">
     <picture class="image__picture"><img src="https://media.cnn.com/api/v1/images/stellar/prod/230809175301-fernando-villavicencio-aug-8.jpg?c=16x9&amp;q=w_250,c_fill" alt="Former Assembly member and now presidential candidate, Fernando Villavicencio, speaks to journalists upon his arrival at the Attorney General's Office in Quito on August 8, 2023. Fernando Villavicencio asked the Attorney General's Office to investigate former officials related to the oil sector of the governments of Rafael Correa, Lenín Moreno, and Guillermo Lasso as part of a criminal complaint that he filed on Tuesday. (Photo by Rodrigo BUENDIA / AFP) (Photo by RODRIGO BUENDIA/AFP via Getty Images)" class="image__dam-img image__dam-img--loading" onload="this.classList.remove('image__dam-img--loading')" onerror="imageLoadError(this)" height="900" width="1600" loading="lazy"></picture>
  </div>
  <div class="image__metadata"></div>
  
</div>

              </div>
          </div>
          <div class="ad-feedback-link-container">
              
<div data-ad-type="VIDEO" data-ad-identifier="" class="ad-feedback-link">
  <div class="ad-feedback-link__label">Video Ad Feedback</div>
</div>
          </div>
          <div class="video-resource__details">
              <div data-editable="headline" class="video-resource__headline">Video appears to show moment of the assassination of Ecuador's presidential candidate</div>
              <div class="video-resource__credit">
                      <span class="video-resource__duration">
                            <svg class="icon-sig-video" width="24" height="24" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="M12 3.333c-4.779 0-8.667 3.888-8.667 8.667S7.221 20.667 12 20.667s8.667-3.888 8.667-8.667S16.779 3.333 12 3.333M12 22C6.486 22 2 17.514 2 12S6.486 2 12 2s10 4.486 10 10-4.486 10-10 10m-1.064-6.793l4.61-2.74a.715.715 0 00-.003-1.23l-4.61-2.712a.714.714 0 00-1.076.616v5.452c0 .554.603.897 1.08.614"></path></svg>

                          00:46
                      </span>
                      <div class="video-resource__label-status">
                          Now playing
                      </div>
                      <span class="video-resource__source"> - Source:
              <a href="https://www.cnn.com/" class="video-resource__source-url">CNN</a>
  </span>
              </div>
          </div>
      </div><div data-uri="cms.cnn.com/_components/video-resource/instances/h_8a01825b2fe5267c6277dcac7d3552d4-h_ba74c952f5f3ac3a094a726d0c92d828-pageTop@published" data-component-name="video-resource" data-editable="settings" class="video-resource" data-index="idx-0" data-canonical-url-path="/videos/business/2023/08/18/china-economy-impact-rest-of-the-world-simon-baptist-sot-ovn-hnk-vpx.cnn" data-video-instance="cms.cnn.com/_components/video-resource/instances/h_8a01825b2fe5267c6277dcac7d3552d4-h_ba74c952f5f3ac3a094a726d0c92d828-pageTop@published" data-video-id="business/2023/08/18/china-economy-impact-rest-of-the-world-simon-baptist-sot-ovn-hnk-vpx.cnn" data-live="" data-headline="Hear how China's economic slowdown could hurt and benefit other countries" data-description="Simon Baptist, Chief Economist of the Economist Intelligence Unit, joins CNN's Michael Holmes to discuss how China's economic slowdown could impact the rest of the world. " data-duration="01:27" data-source-html="<span class=&quot;video-resource__source&quot;> - Source:
              <a href=&quot;https://www.cnn.com/&quot; class=&quot;video-resource__source-url&quot;>CNN</a>
  </span>" data-fave-thumbnails="{&quot;big&quot;: { &quot;uri&quot;: &quot;https://media.cnn.com/api/v1/images/stellar/prod/230818135614-screengrab-simon-baptist.jpg?c=16x9&amp;q=h_540,w_960,c_fill&quot; }, &quot;small&quot;: { &quot;uri&quot;: &quot;https://media.cnn.com/api/v1/images/stellar/prod/230818135614-screengrab-simon-baptist.jpg?c=16x9&amp;q=h_540,w_960,c_fill&quot; }  }" data-vr-video="" data-show-html="<!-- unable to render partial show without a supplied context -->" data-check-event-based-preview="" data-network-id="" data-details="" data-position="4">
          <div>
              <div class="video-resource__image">
                      <div data-uri="cms.cnn.com/_components/image/instances/thumbnail-image-3abdd24fad6a43520187126a5cfca0fc@published" class="image image__hide-placeholder" data-image-variation="image" data-name="screengrab simon baptist" data-component-name="image" data-observe-resizes="" data-breakpoints="{&quot;image--eq-extra-small&quot;: 115, &quot;image--eq-small&quot;: 300}" data-original-ratio="0.5625" data-original-height="1080" data-original-width="1920" data-url="https://media.cnn.com/api/v1/images/stellar/prod/230818135614-screengrab-simon-baptist.jpg?c=original" data-unselectable="true">
    
  <div class="image__container " data-image-variation="image" data-breakpoints="{&quot;image--eq-extra-small&quot;: 115, &quot;image--eq-small&quot;: 300, &quot;image--show-credits&quot;: 596}">
     <picture class="image__picture"><img src="https://media.cnn.com/api/v1/images/stellar/prod/230818135614-screengrab-simon-baptist.jpg?c=16x9&amp;q=w_250,c_fill" alt="screengrab simon baptist" class="image__dam-img" onload="this.classList.remove('image__dam-img--loading')" onerror="imageLoadError(this)" height="1080" width="1920"></picture>
  </div>
  <div class="image__metadata"></div>
  
</div>

              </div>
          </div>
          <div class="ad-feedback-link-container">
              
<div data-ad-type="VIDEO" data-ad-identifier="" class="ad-feedback-link">
  <div class="ad-feedback-link__label">Video Ad Feedback</div>
</div>
          </div>
          <div class="video-resource__details">
              <div data-editable="headline" class="video-resource__headline">Hear how China's economic slowdown could hurt and benefit other countries</div>
              <div class="video-resource__credit">
                      <span class="video-resource__duration">
                            <svg class="icon-sig-video" width="24" height="24" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="M12 3.333c-4.779 0-8.667 3.888-8.667 8.667S7.221 20.667 12 20.667s8.667-3.888 8.667-8.667S16.779 3.333 12 3.333M12 22C6.486 22 2 17.514 2 12S6.486 2 12 2s10 4.486 10 10-4.486 10-10 10m-1.064-6.793l4.61-2.74a.715.715 0 00-.003-1.23l-4.61-2.712a.714.714 0 00-1.076.616v5.452c0 .554.603.897 1.08.614"></path></svg>

                          01:27
                      </span>
                      <div class="video-resource__label-status">
                          Now playing
                      </div>
                      <span class="video-resource__source"> - Source:
              <a href="https://www.cnn.com/" class="video-resource__source-url">CNN</a>
  </span>
              </div>
          </div>
      </div>

              
              
  
  

<div data-uri="cms.cnn.com/_components/video-resource/instances/h_f2504ec54719b0f1d6ab48e278efa5f8-h_064a8f1e60a7f998d33c486251fcbafe@published" data-component-name="video-resource" data-editable="settings" class="video-resource" data-index="idx-1" data-canonical-url-path="/videos/world/2023/08/18/tenerife-wildfire-satellite-images-lon-orig-cw.cnn" data-video-instance="cms.cnn.com/_components/video-resource/instances/h_f2504ec54719b0f1d6ab48e278efa5f8-h_064a8f1e60a7f998d33c486251fcbafe@published" data-video-id="world/2023/08/18/tenerife-wildfire-satellite-images-lon-orig-cw.cnn" data-live="" data-headline="Satellite images show scale of wildfires in Tenerife" data-description="More than 3000 people have been evacuated amid spreading wildfires on the Spanish Canary Island of Tenerife, which have already burned around 6,424 acres of land. " data-duration="00:59" data-source-html="<span class=&quot;video-resource__source&quot;> - Source:
              <a href=&quot;https://www.cnn.com/&quot; class=&quot;video-resource__source-url&quot;>CNN</a>
  </span>" data-fave-thumbnails="{&quot;big&quot;: { &quot;uri&quot;: &quot;https://media.cnn.com/api/v1/images/stellar/prod/230818143433-tenerife-wildfires.jpg?c=16x9&amp;q=h_540,w_960,c_fill&quot; }, &quot;small&quot;: { &quot;uri&quot;: &quot;https://media.cnn.com/api/v1/images/stellar/prod/230818143433-tenerife-wildfires.jpg?c=16x9&amp;q=h_540,w_960,c_fill&quot; }  }" data-vr-video="" data-show-html="<!-- unable to render partial show without a supplied context -->" data-check-event-based-preview="" data-network-id="" data-details="" data-position="5">
          <div>
              <div class="video-resource__image">
                      <div data-uri="cms.cnn.com/_components/image/instances/thumbnail-image-bcb656482f2c4f666fac9f7df2cb4988@published" class="image image__hide-placeholder" data-image-variation="image" data-name="Tenerife wildfires" data-component-name="image" data-observe-resizes="" data-breakpoints="{&quot;image--eq-extra-small&quot;: 115, &quot;image--eq-small&quot;: 300}" data-original-ratio="0.5625" data-original-height="1080" data-original-width="1920" data-url="https://media.cnn.com/api/v1/images/stellar/prod/230818143433-tenerife-wildfires.jpg?c=original" data-unselectable="true">
    
  <div class="image__container " data-image-variation="image" data-breakpoints="{&quot;image--eq-extra-small&quot;: 115, &quot;image--eq-small&quot;: 300, &quot;image--show-credits&quot;: 596}">
     <picture class="image__picture"><img src="https://media.cnn.com/api/v1/images/stellar/prod/230818143433-tenerife-wildfires.jpg?c=16x9&amp;q=w_250,c_fill" alt="Tenerife wildfires" class="image__dam-img" onload="this.classList.remove('image__dam-img--loading')" onerror="imageLoadError(this)" height="1080" width="1920"></picture>
  </div>
  <div class="image__metadata"></div>
  
</div>

              </div>
          </div>
          <div class="ad-feedback-link-container">
              
<div data-ad-type="VIDEO" data-ad-identifier="" class="ad-feedback-link">
  <div class="ad-feedback-link__label">Video Ad Feedback</div>
</div>
          </div>
          <div class="video-resource__details">
              <div data-editable="headline" class="video-resource__headline">Satellite images show scale of wildfires in Tenerife</div>
              <div class="video-resource__credit">
                      <span class="video-resource__duration">
                            <svg class="icon-sig-video" width="24" height="24" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="M12 3.333c-4.779 0-8.667 3.888-8.667 8.667S7.221 20.667 12 20.667s8.667-3.888 8.667-8.667S16.779 3.333 12 3.333M12 22C6.486 22 2 17.514 2 12S6.486 2 12 2s10 4.486 10 10-4.486 10-10 10m-1.064-6.793l4.61-2.74a.715.715 0 00-.003-1.23l-4.61-2.712a.714.714 0 00-1.076.616v5.452c0 .554.603.897 1.08.614"></path></svg>

                          00:59
                      </span>
                      <div class="video-resource__label-status">
                          Now playing
                      </div>
                      <span class="video-resource__source"> - Source:
              <a href="https://www.cnn.com/" class="video-resource__source-url">CNN</a>
  </span>
              </div>
          </div>
      </div>

              
              
  
  

<div data-uri="cms.cnn.com/_components/video-resource/instances/h_c91deaa3f9432afa27ead78c3c1db2e5-h_064a8f1e60a7f998d33c486251fcbafe@published" data-component-name="video-resource" data-editable="settings" class="video-resource" data-index="idx-2" data-canonical-url-path="/videos/world/2023/08/18/canada-wildfires-yellowknife-evacuations-newton-nc-vpx.cnn" data-video-instance="cms.cnn.com/_components/video-resource/instances/h_c91deaa3f9432afa27ead78c3c1db2e5-h_064a8f1e60a7f998d33c486251fcbafe@published" data-video-id="world/2023/08/18/canada-wildfires-yellowknife-evacuations-newton-nc-vpx.cnn" data-live="" data-headline="Entire city of Yellowknife forced to evacuate as fires rage" data-description="Thousands of Yellowknife residents have been <a href=&quot;https://www.cnn.com/2023/08/18/americas/canada-northwest-territories-wildfire-evacuation-friday/index.html&quot; target=&quot;_blank&quot;>ordered to evacuate</a> as crews battle wildfires in the Northwest Territories of Canada. CNN's Paula Newton reports." data-duration="01:55" data-source-html="<span class=&quot;video-resource__source&quot;> - Source:
              <a href=&quot;https://www.cnn.com/&quot; class=&quot;video-resource__source-url&quot;>CNN</a>
  </span>" data-fave-thumbnails="{&quot;big&quot;: { &quot;uri&quot;: &quot;https://media.cnn.com/api/v1/images/stellar/prod/230818142510-yellowknife-wildfire.jpg?c=16x9&amp;q=h_540,w_960,c_fill&quot; }, &quot;small&quot;: { &quot;uri&quot;: &quot;https://media.cnn.com/api/v1/images/stellar/prod/230818142510-yellowknife-wildfire.jpg?c=16x9&amp;q=h_540,w_960,c_fill&quot; }  }" data-vr-video="" data-show-html="<!-- unable to render partial show without a supplied context -->" data-check-event-based-preview="" data-network-id="" data-details="" data-position="6">
          <div>
              <div class="video-resource__image">
                      <div data-uri="cms.cnn.com/_components/image/instances/thumbnail-image-a2c5a82ca28a86ceee225db0cc5228ed@published" class="image image__hide-placeholder" data-image-variation="image" data-name="yellowknife wildfire" data-component-name="image" data-observe-resizes="" data-breakpoints="{&quot;image--eq-extra-small&quot;: 115, &quot;image--eq-small&quot;: 300}" data-original-ratio="0.5625" data-original-height="1080" data-original-width="1920" data-url="https://media.cnn.com/api/v1/images/stellar/prod/230818142510-yellowknife-wildfire.jpg?c=original" data-unselectable="true">
    
  <div class="image__container " data-image-variation="image" data-breakpoints="{&quot;image--eq-extra-small&quot;: 115, &quot;image--eq-small&quot;: 300, &quot;image--show-credits&quot;: 596}">
     <picture class="image__picture"><img src="https://media.cnn.com/api/v1/images/stellar/prod/230818142510-yellowknife-wildfire.jpg?c=16x9&amp;q=w_250,c_fill" alt="yellowknife wildfire" class="image__dam-img" onload="this.classList.remove('image__dam-img--loading')" onerror="imageLoadError(this)" height="1080" width="1920"></picture>
  </div>
  <div class="image__metadata"></div>
  
</div>

              </div>
          </div>
          <div class="ad-feedback-link-container">
              
<div data-ad-type="VIDEO" data-ad-identifier="" class="ad-feedback-link">
  <div class="ad-feedback-link__label">Video Ad Feedback</div>
</div>
          </div>
          <div class="video-resource__details">
              <div data-editable="headline" class="video-resource__headline">Entire city of Yellowknife forced to evacuate as fires rage</div>
              <div class="video-resource__credit">
                      <span class="video-resource__duration">
                            <svg class="icon-sig-video" width="24" height="24" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="M12 3.333c-4.779 0-8.667 3.888-8.667 8.667S7.221 20.667 12 20.667s8.667-3.888 8.667-8.667S16.779 3.333 12 3.333M12 22C6.486 22 2 17.514 2 12S6.486 2 12 2s10 4.486 10 10-4.486 10-10 10m-1.064-6.793l4.61-2.74a.715.715 0 00-.003-1.23l-4.61-2.712a.714.714 0 00-1.076.616v5.452c0 .554.603.897 1.08.614"></path></svg>

                          01:55
                      </span>
                      <div class="video-resource__label-status">
                          Now playing
                      </div>
                      <span class="video-resource__source"> - Source:
              <a href="https://www.cnn.com/" class="video-resource__source-url">CNN</a>
  </span>
              </div>
          </div>
      </div>

              
              
  
  

<div data-uri="cms.cnn.com/_components/video-resource/instances/h_957de46119e0c8aa77246068dd309ba1-h_064a8f1e60a7f998d33c486251fcbafe@published" data-component-name="video-resource" data-editable="settings" class="video-resource" data-index="idx-3" data-canonical-url-path="/videos/world/2023/08/17/north-korea-icbm-weapon-intelligence-pkg-ripley-lead-vpx.cnn" data-video-instance="cms.cnn.com/_components/video-resource/instances/h_957de46119e0c8aa77246068dd309ba1-h_064a8f1e60a7f998d33c486251fcbafe@published" data-video-id="world/2023/08/17/north-korea-icbm-weapon-intelligence-pkg-ripley-lead-vpx.cnn" data-live="" data-headline="See the new weapon North Korea may test soon" data-description="CNN's Will Ripley breaks down new South Korean intelligence that North Korea may be preparing to test a new intercontinental ballistic missile." data-duration="02:07" data-source-html="<span class=&quot;video-resource__source&quot;> - Source:
              <a href=&quot;https://www.cnn.com/&quot; class=&quot;video-resource__source-url&quot;>CNN</a>
  </span>" data-fave-thumbnails="{&quot;big&quot;: { &quot;uri&quot;: &quot;https://media.cnn.com/api/v1/images/stellar/prod/230817172419-north-korea-icbm.jpg?c=16x9&amp;q=h_540,w_960,c_fill&quot; }, &quot;small&quot;: { &quot;uri&quot;: &quot;https://media.cnn.com/api/v1/images/stellar/prod/230817172419-north-korea-icbm.jpg?c=16x9&amp;q=h_540,w_960,c_fill&quot; }  }" data-vr-video="" data-show-html="<a data-uri=&quot;cms.cnn.com/_components/show/instances/show_00E11A3E-A80E-6443-B504-FFF32537C2F7@published&quot; href=&quot;https://www.cnn.com/shows/the-lead&quot; class=&quot;show show__showlink-url&quot;> The Lead
  </a>" data-check-event-based-preview="" data-network-id="" data-details="" data-position="7">
          <div>
              <div class="video-resource__image">
                      <div data-uri="cms.cnn.com/_components/image/instances/thumbnail-image-d05806dc134629abaf5c073f1fbed7a8@published" class="image image__hide-placeholder" data-image-variation="image" data-name="north korea icbm" data-component-name="image" data-observe-resizes="" data-breakpoints="{&quot;image--eq-extra-small&quot;: 115, &quot;image--eq-small&quot;: 300}" data-original-ratio="0.5625" data-original-height="1080" data-original-width="1920" data-url="https://media.cnn.com/api/v1/images/stellar/prod/230817172419-north-korea-icbm.jpg?c=original" data-unselectable="true">
    
  <div class="image__container " data-image-variation="image" data-breakpoints="{&quot;image--eq-extra-small&quot;: 115, &quot;image--eq-small&quot;: 300, &quot;image--show-credits&quot;: 596}">
     <picture class="image__picture"><img src="https://media.cnn.com/api/v1/images/stellar/prod/230817172419-north-korea-icbm.jpg?c=16x9&amp;q=w_250,c_fill" alt="north korea icbm" class="image__dam-img" onload="this.classList.remove('image__dam-img--loading')" onerror="imageLoadError(this)" height="1080" width="1920"></picture>
  </div>
  <div class="image__metadata"></div>
  
</div>

              </div>
          </div>
          <div class="ad-feedback-link-container">
              
<div data-ad-type="VIDEO" data-ad-identifier="" class="ad-feedback-link">
  <div class="ad-feedback-link__label">Video Ad Feedback</div>
</div>
          </div>
          <div class="video-resource__details">
              <div data-editable="headline" class="video-resource__headline">See the new weapon North Korea may test soon</div>
              <div class="video-resource__credit">
                      <span class="video-resource__duration">
                            <svg class="icon-sig-video" width="24" height="24" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="M12 3.333c-4.779 0-8.667 3.888-8.667 8.667S7.221 20.667 12 20.667s8.667-3.888 8.667-8.667S16.779 3.333 12 3.333M12 22C6.486 22 2 17.514 2 12S6.486 2 12 2s10 4.486 10 10-4.486 10-10 10m-1.064-6.793l4.61-2.74a.715.715 0 00-.003-1.23l-4.61-2.712a.714.714 0 00-1.076.616v5.452c0 .554.603.897 1.08.614"></path></svg>

                          02:07
                      </span>
                      <div class="video-resource__label-status">
                          Now playing
                      </div>
                      <span class="video-resource__source"> - Source:
              <a href="https://www.cnn.com/" class="video-resource__source-url">CNN</a>
  </span>
              </div>
          </div>
      </div>

              
                  
              
  
  

<div data-uri="cms.cnn.com/_components/video-resource/instances/h_a03b5367efe77c757424e39c852e8f33-h_064a8f1e60a7f998d33c486251fcbafe@published" data-component-name="video-resource" data-editable="settings" class="video-resource" data-index="idx-4" data-canonical-url-path="/videos/world/2023/08/17/bus-fire-argentina-passengers-flee-lon-orig-ao.cnn" data-video-instance="cms.cnn.com/_components/video-resource/instances/h_a03b5367efe77c757424e39c852e8f33-h_064a8f1e60a7f998d33c486251fcbafe@published" data-video-id="world/2023/08/17/bus-fire-argentina-passengers-flee-lon-orig-ao.cnn" data-live="" data-headline="Video shows fire engulf bus as passengers flee from flames" data-description="The fire, captured by Buenos Aires police security cameras, was reportedly caused by an electrical mechanical problem. Local firefighters put out the blaze and no one has been reported injured, according to Reuters." data-duration="00:41" data-source-html="<span class=&quot;video-resource__source&quot;> - Source:
              <a href=&quot;https://www.cnn.com/&quot; class=&quot;video-resource__source-url&quot;>CNN</a>
  </span>" data-fave-thumbnails="{&quot;big&quot;: { &quot;uri&quot;: &quot;https://media.cnn.com/api/v1/images/stellar/prod/230817113359-bus-fire-argentina.jpg?c=16x9&amp;q=h_540,w_960,c_fill&quot; }, &quot;small&quot;: { &quot;uri&quot;: &quot;https://media.cnn.com/api/v1/images/stellar/prod/230817113359-bus-fire-argentina.jpg?c=16x9&amp;q=h_540,w_960,c_fill&quot; }  }" data-vr-video="" data-show-html="<!-- unable to render partial show without a supplied context -->" data-check-event-based-preview="" data-network-id="" data-details="" data-position="8">
          <div>
              <div class="video-resource__image">
                      <div data-uri="cms.cnn.com/_components/image/instances/thumbnail-image-e65c096899c3c210153a812e26fd968b@published" class="image image__hide-placeholder" data-image-variation="image" data-name="bus fire argentina" data-component-name="image" data-observe-resizes="" data-breakpoints="{&quot;image--eq-extra-small&quot;: 115, &quot;image--eq-small&quot;: 300}" data-original-ratio="0.5625" data-original-height="1080" data-original-width="1920" data-url="https://media.cnn.com/api/v1/images/stellar/prod/230817113359-bus-fire-argentina.jpg?c=original" data-unselectable="true">
    
  <div class="image__container " data-image-variation="image" data-breakpoints="{&quot;image--eq-extra-small&quot;: 115, &quot;image--eq-small&quot;: 300, &quot;image--show-credits&quot;: 596}">
     <picture class="image__picture"><img src="https://media.cnn.com/api/v1/images/stellar/prod/230817113359-bus-fire-argentina.jpg?c=16x9&amp;q=w_250,c_fill" alt="bus fire argentina" class="image__dam-img image__dam-img--loading" onload="this.classList.remove('image__dam-img--loading')" onerror="imageLoadError(this)" height="1080" width="1920" loading="lazy"></picture>
  </div>
  <div class="image__metadata"></div>
  
</div>

              </div>
          </div>
          <div class="ad-feedback-link-container">
              
<div data-ad-type="VIDEO" data-ad-identifier="" class="ad-feedback-link">
  <div class="ad-feedback-link__label">Video Ad Feedback</div>
</div>
          </div>
          <div class="video-resource__details">
              <div data-editable="headline" class="video-resource__headline">Video shows fire engulf bus as passengers flee from flames</div>
              <div class="video-resource__credit">
                      <span class="video-resource__duration">
                            <svg class="icon-sig-video" width="24" height="24" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="M12 3.333c-4.779 0-8.667 3.888-8.667 8.667S7.221 20.667 12 20.667s8.667-3.888 8.667-8.667S16.779 3.333 12 3.333M12 22C6.486 22 2 17.514 2 12S6.486 2 12 2s10 4.486 10 10-4.486 10-10 10m-1.064-6.793l4.61-2.74a.715.715 0 00-.003-1.23l-4.61-2.712a.714.714 0 00-1.076.616v5.452c0 .554.603.897 1.08.614"></path></svg>

                          00:41
                      </span>
                      <div class="video-resource__label-status">
                          Now playing
                      </div>
                      <span class="video-resource__source"> - Source:
              <a href="https://www.cnn.com/" class="video-resource__source-url">CNN</a>
  </span>
              </div>
          </div>
      </div>

              
                  
              
  
  

<div data-uri="cms.cnn.com/_components/video-resource/instances/h_37fb4c3bba81e6fc99b8d10d3447128e-h_064a8f1e60a7f998d33c486251fcbafe@published" data-component-name="video-resource" data-editable="settings" class="video-resource" data-index="idx-5" data-canonical-url-path="/videos/world/2023/08/16/sudan-darfur-massacre-investigation-nima-elbagir-lead-intl-ldn-vpx.cnn" data-video-instance="cms.cnn.com/_components/video-resource/instances/h_37fb4c3bba81e6fc99b8d10d3447128e-h_064a8f1e60a7f998d33c486251fcbafe@published" data-video-id="world/2023/08/16/sudan-darfur-massacre-investigation-nima-elbagir-lead-intl-ldn-vpx.cnn" data-live="" data-headline="Body collectors, survivors recount day-long massacre of families fleeing Darfur" data-description="A CNN investigation has uncovered what is believed to be one of the most violent incidents in Darfur's history, when the paramilitary Rapid Support Forces and its allied militias gunned down fleeing families, shooting them as they drowned and summarily executing them in the desert, in a massacre that unfolded over the course of a single day on June 15. CNN's Nima Elbagir reports." data-duration="05:24" data-source-html="<span class=&quot;video-resource__source&quot;> - Source:
              <a href=&quot;https://www.cnn.com/&quot; class=&quot;video-resource__source-url&quot;>CNN</a>
  </span>" data-fave-thumbnails="{&quot;big&quot;: { &quot;uri&quot;: &quot;https://media.cnn.com/api/v1/images/stellar/prod/230816172532-geneina-sudan-rsf-war-elbagir.jpg?c=16x9&amp;q=h_540,w_960,c_fill&quot; }, &quot;small&quot;: { &quot;uri&quot;: &quot;https://media.cnn.com/api/v1/images/stellar/prod/230816172532-geneina-sudan-rsf-war-elbagir.jpg?c=16x9&amp;q=h_540,w_960,c_fill&quot; }  }" data-vr-video="" data-show-html="<a data-uri=&quot;cms.cnn.com/_components/show/instances/show_00E11A3E-A80E-6443-B504-FFF32537C2F7@published&quot; href=&quot;https://www.cnn.com/shows/the-lead&quot; class=&quot;show show__showlink-url&quot;> The Lead
  </a>" data-check-event-based-preview="" data-network-id="" data-details="" data-position="9">
          <div>
              <div class="video-resource__image">
                      <div data-uri="cms.cnn.com/_components/image/instances/thumbnail-image-d63fde33d07a3a220b0bf29007d4cfe8@published" class="image image__hide-placeholder" data-image-variation="image" data-name="geneina sudan rsf war elbagir" data-component-name="image" data-observe-resizes="" data-breakpoints="{&quot;image--eq-extra-small&quot;: 115, &quot;image--eq-small&quot;: 300}" data-original-ratio="0.5625" data-original-height="1080" data-original-width="1920" data-url="https://media.cnn.com/api/v1/images/stellar/prod/230816172532-geneina-sudan-rsf-war-elbagir.jpg?c=original" data-unselectable="true">
    
  <div class="image__container " data-image-variation="image" data-breakpoints="{&quot;image--eq-extra-small&quot;: 115, &quot;image--eq-small&quot;: 300, &quot;image--show-credits&quot;: 596}">
     <picture class="image__picture"><img src="https://media.cnn.com/api/v1/images/stellar/prod/230816172532-geneina-sudan-rsf-war-elbagir.jpg?c=16x9&amp;q=w_250,c_fill" alt="geneina sudan rsf war elbagir" class="image__dam-img image__dam-img--loading" onload="this.classList.remove('image__dam-img--loading')" onerror="imageLoadError(this)" height="1080" width="1920" loading="lazy"></picture>
  </div>
  <div class="image__metadata"></div>
  
</div>

              </div>
          </div>
          <div class="ad-feedback-link-container">
              
<div data-ad-type="VIDEO" data-ad-identifier="" class="ad-feedback-link">
  <div class="ad-feedback-link__label">Video Ad Feedback</div>
</div>
          </div>
          <div class="video-resource__details">
              <div data-editable="headline" class="video-resource__headline">Body collectors, survivors recount day-long massacre of families fleeing Darfur</div>
              <div class="video-resource__credit">
                      <span class="video-resource__duration">
                            <svg class="icon-sig-video" width="24" height="24" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="M12 3.333c-4.779 0-8.667 3.888-8.667 8.667S7.221 20.667 12 20.667s8.667-3.888 8.667-8.667S16.779 3.333 12 3.333M12 22C6.486 22 2 17.514 2 12S6.486 2 12 2s10 4.486 10 10-4.486 10-10 10m-1.064-6.793l4.61-2.74a.715.715 0 00-.003-1.23l-4.61-2.712a.714.714 0 00-1.076.616v5.452c0 .554.603.897 1.08.614"></path></svg>

                          05:24
                      </span>
                      <div class="video-resource__label-status">
                          Now playing
                      </div>
                      <span class="video-resource__source"> - Source:
              <a href="https://www.cnn.com/" class="video-resource__source-url">CNN</a>
  </span>
              </div>
          </div>
      </div>

              
                  
              
  
  

<div data-uri="cms.cnn.com/_components/video-resource/instances/h_4b15b3d53c4528a8c4ebe0b6b209f58c-h_064a8f1e60a7f998d33c486251fcbafe@published" data-component-name="video-resource" data-editable="settings" class="video-resource" data-index="idx-6" data-canonical-url-path="/videos/world/2023/08/15/bardonecchia-italy-river-flood-mud-lon-orig-ao.cnn" data-video-instance="cms.cnn.com/_components/video-resource/instances/h_4b15b3d53c4528a8c4ebe0b6b209f58c-h_064a8f1e60a7f998d33c486251fcbafe@published" data-video-id="world/2023/08/15/bardonecchia-italy-river-flood-mud-lon-orig-ao.cnn" data-live="" data-headline="See Italian river burst through bridge, covering town in mud" data-description="Mud flooded the streets of Bardonecchia, Italy, after the river Merdovine burst its banks due to a landslide in mountains nearby." data-duration="00:36" data-source-html="<span class=&quot;video-resource__source&quot;> - Source:
              <a href=&quot;https://www.cnn.com/&quot; class=&quot;video-resource__source-url&quot;>CNN</a>
  </span>" data-fave-thumbnails="{&quot;big&quot;: { &quot;uri&quot;: &quot;https://media.cnn.com/api/v1/images/stellar/prod/230815144100-italy-river-burst.jpg?c=16x9&amp;q=h_540,w_960,c_fill&quot; }, &quot;small&quot;: { &quot;uri&quot;: &quot;https://media.cnn.com/api/v1/images/stellar/prod/230815144100-italy-river-burst.jpg?c=16x9&amp;q=h_540,w_960,c_fill&quot; }  }" data-vr-video="" data-show-html="<!-- unable to render partial show without a supplied context -->" data-check-event-based-preview="" data-network-id="" data-details="" data-position="10">
          <div>
              <div class="video-resource__image">
                      <div data-uri="cms.cnn.com/_components/image/instances/thumbnail-image-8f47fa1e99ba0d13dc846346c87bbc2f@published" class="image image__hide-placeholder" data-image-variation="image" data-name="italy river burst" data-component-name="image" data-observe-resizes="" data-breakpoints="{&quot;image--eq-extra-small&quot;: 115, &quot;image--eq-small&quot;: 300}" data-original-ratio="0.5625" data-original-height="1080" data-original-width="1920" data-url="https://media.cnn.com/api/v1/images/stellar/prod/230815144100-italy-river-burst.jpg?c=original" data-unselectable="true">
    
  <div class="image__container " data-image-variation="image" data-breakpoints="{&quot;image--eq-extra-small&quot;: 115, &quot;image--eq-small&quot;: 300, &quot;image--show-credits&quot;: 596}">
     <picture class="image__picture"><img src="https://media.cnn.com/api/v1/images/stellar/prod/230815144100-italy-river-burst.jpg?c=16x9&amp;q=w_250,c_fill" alt="italy river burst" class="image__dam-img image__dam-img--loading" onload="this.classList.remove('image__dam-img--loading')" onerror="imageLoadError(this)" height="1080" width="1920" loading="lazy"></picture>
  </div>
  <div class="image__metadata"></div>
  
</div>

              </div>
          </div>
          <div class="ad-feedback-link-container">
              
<div data-ad-type="VIDEO" data-ad-identifier="" class="ad-feedback-link">
  <div class="ad-feedback-link__label">Video Ad Feedback</div>
</div>
          </div>
          <div class="video-resource__details">
              <div data-editable="headline" class="video-resource__headline">See Italian river burst through bridge, covering town in mud</div>
              <div class="video-resource__credit">
                      <span class="video-resource__duration">
                            <svg class="icon-sig-video" width="24" height="24" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="M12 3.333c-4.779 0-8.667 3.888-8.667 8.667S7.221 20.667 12 20.667s8.667-3.888 8.667-8.667S16.779 3.333 12 3.333M12 22C6.486 22 2 17.514 2 12S6.486 2 12 2s10 4.486 10 10-4.486 10-10 10m-1.064-6.793l4.61-2.74a.715.715 0 00-.003-1.23l-4.61-2.712a.714.714 0 00-1.076.616v5.452c0 .554.603.897 1.08.614"></path></svg>

                          00:36
                      </span>
                      <div class="video-resource__label-status">
                          Now playing
                      </div>
                      <span class="video-resource__source"> - Source:
              <a href="https://www.cnn.com/" class="video-resource__source-url">CNN</a>
  </span>
              </div>
          </div>
      </div>

              
                  
              
  
  

<div data-uri="cms.cnn.com/_components/video-resource/instances/h_a3547b1f6f4851e6ccc17ec372d6b4a9-h_064a8f1e60a7f998d33c486251fcbafe@published" data-component-name="video-resource" data-editable="settings" class="video-resource" data-index="idx-7" data-canonical-url-path="/videos/world/2023/08/15/northern-india-himachal-pradesh-landslides-ovn-ctd-hnk-vpx.cnn" data-video-instance="cms.cnn.com/_components/video-resource/instances/h_a3547b1f6f4851e6ccc17ec372d6b4a9-h_064a8f1e60a7f998d33c486251fcbafe@published" data-video-id="world/2023/08/15/northern-india-himachal-pradesh-landslides-ovn-ctd-hnk-vpx.cnn" data-live="" data-headline="Dramatic video captures landslide as it happens in northern India" data-description="Dozens of people have died due to the impact of heavy rains in Himachal Pradesh in northern India, the state's chief minister Sukhvinder Singh Sukhu told Indian news agency ANI. " data-duration="00:33" data-source-html="<span class=&quot;video-resource__source&quot;> - Source:
              <a href=&quot;https://www.cnn.com/&quot; class=&quot;video-resource__source-url&quot;>CNN</a>
  </span>" data-fave-thumbnails="{&quot;big&quot;: { &quot;uri&quot;: &quot;https://media.cnn.com/api/v1/images/stellar/prod/230815164237-screengrab-himachai-pradesh-landslide.jpg?c=16x9&amp;q=h_540,w_960,c_fill&quot; }, &quot;small&quot;: { &quot;uri&quot;: &quot;https://media.cnn.com/api/v1/images/stellar/prod/230815164237-screengrab-himachai-pradesh-landslide.jpg?c=16x9&amp;q=h_540,w_960,c_fill&quot; }  }" data-vr-video="" data-show-html="<!-- unable to render partial show without a supplied context -->" data-check-event-based-preview="" data-network-id="" data-details="" data-position="11">
          <div>
              <div class="video-resource__image">
                      <div data-uri="cms.cnn.com/_components/image/instances/thumbnail-image-17b3ee17eb485659919602253d57f35b@published" class="image image__hide-placeholder" data-image-variation="image" data-name="screengrab himachai pradesh landslide" data-component-name="image" data-observe-resizes="" data-breakpoints="{&quot;image--eq-extra-small&quot;: 115, &quot;image--eq-small&quot;: 300}" data-original-ratio="0.5625" data-original-height="1080" data-original-width="1920" data-url="https://media.cnn.com/api/v1/images/stellar/prod/230815164237-screengrab-himachai-pradesh-landslide.jpg?c=original" data-unselectable="true">
    
  <div class="image__container " data-image-variation="image" data-breakpoints="{&quot;image--eq-extra-small&quot;: 115, &quot;image--eq-small&quot;: 300, &quot;image--show-credits&quot;: 596}">
     <picture class="image__picture"><img src="https://media.cnn.com/api/v1/images/stellar/prod/230815164237-screengrab-himachai-pradesh-landslide.jpg?c=16x9&amp;q=w_250,c_fill" alt="screengrab himachai pradesh landslide" class="image__dam-img image__dam-img--loading" onload="this.classList.remove('image__dam-img--loading')" onerror="imageLoadError(this)" height="1080" width="1920" loading="lazy"></picture>
  </div>
  <div class="image__metadata"></div>
  
</div>

              </div>
          </div>
          <div class="ad-feedback-link-container">
              
<div data-ad-type="VIDEO" data-ad-identifier="" class="ad-feedback-link">
  <div class="ad-feedback-link__label">Video Ad Feedback</div>
</div>
          </div>
          <div class="video-resource__details">
              <div data-editable="headline" class="video-resource__headline">Dramatic video captures landslide as it happens in northern India</div>
              <div class="video-resource__credit">
                      <span class="video-resource__duration">
                            <svg class="icon-sig-video" width="24" height="24" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="M12 3.333c-4.779 0-8.667 3.888-8.667 8.667S7.221 20.667 12 20.667s8.667-3.888 8.667-8.667S16.779 3.333 12 3.333M12 22C6.486 22 2 17.514 2 12S6.486 2 12 2s10 4.486 10 10-4.486 10-10 10m-1.064-6.793l4.61-2.74a.715.715 0 00-.003-1.23l-4.61-2.712a.714.714 0 00-1.076.616v5.452c0 .554.603.897 1.08.614"></path></svg>

                          00:33
                      </span>
                      <div class="video-resource__label-status">
                          Now playing
                      </div>
                      <span class="video-resource__source"> - Source:
              <a href="https://www.cnn.com/" class="video-resource__source-url">CNN</a>
  </span>
              </div>
          </div>
      </div>

              
                  
              
  
  

<div data-uri="cms.cnn.com/_components/video-resource/instances/h_77deda3154b2197727d6f25bcecadbad-h_064a8f1e60a7f998d33c486251fcbafe@published" data-component-name="video-resource" data-editable="settings" class="video-resource" data-index="idx-8" data-canonical-url-path="/videos/travel/2023/08/15/missing-australian-surfers-found-indonesia-lon-orig-cw.cnn" data-video-instance="cms.cnn.com/_components/video-resource/instances/h_77deda3154b2197727d6f25bcecadbad-h_064a8f1e60a7f998d33c486251fcbafe@published" data-video-id="travel/2023/08/15/missing-australian-surfers-found-indonesia-lon-orig-cw.cnn" data-live="" data-headline="See the moment surfers are found after 38 hours lost at sea" data-description="Australian surfers and Indonesian crew members were found on nothing but their boards after being caught in a storm off the coast of Indonesia." data-duration="00:43" data-source-html="<span class=&quot;video-resource__source&quot;> - Source:
              <a href=&quot;https://www.cnn.com/&quot; class=&quot;video-resource__source-url&quot;>CNN</a>
  </span>" data-fave-thumbnails="{&quot;big&quot;: { &quot;uri&quot;: &quot;https://media.cnn.com/api/v1/images/stellar/prod/230815135955-australian-surfers-found.jpg?c=16x9&amp;q=h_540,w_960,c_fill&quot; }, &quot;small&quot;: { &quot;uri&quot;: &quot;https://media.cnn.com/api/v1/images/stellar/prod/230815135955-australian-surfers-found.jpg?c=16x9&amp;q=h_540,w_960,c_fill&quot; }  }" data-vr-video="" data-show-html="<!-- unable to render partial show without a supplied context -->" data-check-event-based-preview="" data-network-id="" data-details="" data-position="12">
          <div>
              <div class="video-resource__image">
                      <div data-uri="cms.cnn.com/_components/image/instances/thumbnail-image-d4f7d370bff8337959a54a307010e1ff@published" class="image image__hide-placeholder" data-image-variation="image" data-name="Australian Surfers found" data-component-name="image" data-observe-resizes="" data-breakpoints="{&quot;image--eq-extra-small&quot;: 115, &quot;image--eq-small&quot;: 300}" data-original-ratio="0.5625" data-original-height="1080" data-original-width="1920" data-url="https://media.cnn.com/api/v1/images/stellar/prod/230815135955-australian-surfers-found.jpg?c=original" data-unselectable="true">
    
  <div class="image__container " data-image-variation="image" data-breakpoints="{&quot;image--eq-extra-small&quot;: 115, &quot;image--eq-small&quot;: 300, &quot;image--show-credits&quot;: 596}">
     <picture class="image__picture"><img src="https://media.cnn.com/api/v1/images/stellar/prod/230815135955-australian-surfers-found.jpg?c=16x9&amp;q=w_250,c_fill" alt="Australian Surfers found" class="image__dam-img image__dam-img--loading" onload="this.classList.remove('image__dam-img--loading')" onerror="imageLoadError(this)" height="1080" width="1920" loading="lazy"></picture>
  </div>
  <div class="image__metadata"></div>
  
</div>

              </div>
          </div>
          <div class="ad-feedback-link-container">
              
<div data-ad-type="VIDEO" data-ad-identifier="" class="ad-feedback-link">
  <div class="ad-feedback-link__label">Video Ad Feedback</div>
</div>
          </div>
          <div class="video-resource__details">
              <div data-editable="headline" class="video-resource__headline">See the moment surfers are found after 38 hours lost at sea</div>
              <div class="video-resource__credit">
                      <span class="video-resource__duration">
                            <svg class="icon-sig-video" width="24" height="24" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="M12 3.333c-4.779 0-8.667 3.888-8.667 8.667S7.221 20.667 12 20.667s8.667-3.888 8.667-8.667S16.779 3.333 12 3.333M12 22C6.486 22 2 17.514 2 12S6.486 2 12 2s10 4.486 10 10-4.486 10-10 10m-1.064-6.793l4.61-2.74a.715.715 0 00-.003-1.23l-4.61-2.712a.714.714 0 00-1.076.616v5.452c0 .554.603.897 1.08.614"></path></svg>

                          00:43
                      </span>
                      <div class="video-resource__label-status">
                          Now playing
                      </div>
                      <span class="video-resource__source"> - Source:
              <a href="https://www.cnn.com/" class="video-resource__source-url">CNN</a>
  </span>
              </div>
          </div>
      </div>

              
                  
              
  
  

<div data-uri="cms.cnn.com/_components/video-resource/instances/h_e08e8ec23717aec71dcd7e25f810fd02-h_064a8f1e60a7f998d33c486251fcbafe@published" data-component-name="video-resource" data-editable="settings" class="video-resource" data-index="idx-9" data-canonical-url-path="/videos/world/2023/08/14/rome-tourism-increase-julius-caesar-assassination-site-wedeman-pkg-nc-vpx.cnn" data-video-instance="cms.cnn.com/_components/video-resource/instances/h_e08e8ec23717aec71dcd7e25f810fd02-h_064a8f1e60a7f998d33c486251fcbafe@published" data-video-id="world/2023/08/14/rome-tourism-increase-julius-caesar-assassination-site-wedeman-pkg-nc-vpx.cnn" data-live="" data-headline="Why this assassination site has become a tourism hotspot in Rome" data-description="As Covid lockdowns end, tourists are flocking Rome's central Largo Argentina square to see the assassination site of Julius Caesar, which took place on the Ides of March  - March 15 - in 44 BC. CNN's Ben Wedeman reports. " data-duration="02:06" data-source-html="<span class=&quot;video-resource__source&quot;> - Source:
              <a href=&quot;https://www.cnn.com/&quot; class=&quot;video-resource__source-url&quot;>CNN</a>
  </span>" data-fave-thumbnails="{&quot;big&quot;: { &quot;uri&quot;: &quot;https://media.cnn.com/api/v1/images/stellar/prod/230814153143-rome-largo-argentina-julius-caesar-site.jpg?c=16x9&amp;q=h_540,w_960,c_fill&quot; }, &quot;small&quot;: { &quot;uri&quot;: &quot;https://media.cnn.com/api/v1/images/stellar/prod/230814153143-rome-largo-argentina-julius-caesar-site.jpg?c=16x9&amp;q=h_540,w_960,c_fill&quot; }  }" data-vr-video="" data-show-html="<!-- unable to render partial show without a supplied context -->" data-check-event-based-preview="" data-network-id="" data-details="" data-position="13">
          <div>
              <div class="video-resource__image">
                      <div data-uri="cms.cnn.com/_components/image/instances/thumbnail-image-752fb169bf27fc7ce2c944fbdb9c3991@published" class="image image__hide-placeholder" data-image-variation="image" data-name="rome largo argentina julius caesar site" data-component-name="image" data-observe-resizes="" data-breakpoints="{&quot;image--eq-extra-small&quot;: 115, &quot;image--eq-small&quot;: 300}" data-original-ratio="0.5625" data-original-height="1080" data-original-width="1920" data-url="https://media.cnn.com/api/v1/images/stellar/prod/230814153143-rome-largo-argentina-julius-caesar-site.jpg?c=original" data-unselectable="true">
    
  <div class="image__container " data-image-variation="image" data-breakpoints="{&quot;image--eq-extra-small&quot;: 115, &quot;image--eq-small&quot;: 300, &quot;image--show-credits&quot;: 596}">
     <picture class="image__picture"><img src="https://media.cnn.com/api/v1/images/stellar/prod/230814153143-rome-largo-argentina-julius-caesar-site.jpg?c=16x9&amp;q=w_250,c_fill" alt="rome largo argentina julius caesar site" class="image__dam-img image__dam-img--loading" onload="this.classList.remove('image__dam-img--loading')" onerror="imageLoadError(this)" height="1080" width="1920" loading="lazy"></picture>
  </div>
  <div class="image__metadata"></div>
  
</div>

              </div>
          </div>
          <div class="ad-feedback-link-container">
              
<div data-ad-type="VIDEO" data-ad-identifier="" class="ad-feedback-link">
  <div class="ad-feedback-link__label">Video Ad Feedback</div>
</div>
          </div>
          <div class="video-resource__details">
              <div data-editable="headline" class="video-resource__headline">Why this assassination site has become a tourism hotspot in Rome</div>
              <div class="video-resource__credit">
                      <span class="video-resource__duration">
                            <svg class="icon-sig-video" width="24" height="24" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="M12 3.333c-4.779 0-8.667 3.888-8.667 8.667S7.221 20.667 12 20.667s8.667-3.888 8.667-8.667S16.779 3.333 12 3.333M12 22C6.486 22 2 17.514 2 12S6.486 2 12 2s10 4.486 10 10-4.486 10-10 10m-1.064-6.793l4.61-2.74a.715.715 0 00-.003-1.23l-4.61-2.712a.714.714 0 00-1.076.616v5.452c0 .554.603.897 1.08.614"></path></svg>

                          02:06
                      </span>
                      <div class="video-resource__label-status">
                          Now playing
                      </div>
                      <span class="video-resource__source"> - Source:
              <a href="https://www.cnn.com/" class="video-resource__source-url">CNN</a>
  </span>
              </div>
          </div>
      </div>

              
                  
              
  
  

<div data-uri="cms.cnn.com/_components/video-resource/instances/h_df75f9161d9c81cff1782d8858e3d2b6-h_064a8f1e60a7f998d33c486251fcbafe@published" data-component-name="video-resource" data-editable="settings" class="video-resource" data-index="idx-10" data-canonical-url-path="/videos/world/2023/08/15/afghanistan-taliban-takeover-two-year-anniversary-coren-dnt-ovn-hnk-vpx.cnn" data-video-instance="cms.cnn.com/_components/video-resource/instances/h_df75f9161d9c81cff1782d8858e3d2b6-h_064a8f1e60a7f998d33c486251fcbafe@published" data-video-id="world/2023/08/15/afghanistan-taliban-takeover-two-year-anniversary-coren-dnt-ovn-hnk-vpx.cnn" data-live="" data-headline="CNN speaks to Afghan women about life after two years of Taliban rule" data-description="It's been two years since the Taliban swept to power in Afghanistan, seizing the capital Kabul with a speed and ease that took the world by surprise. CNN's Anna Coren spoke to Afghan women about their experience over the past two years and their views on the country's future." data-duration="05:08" data-source-html="<span class=&quot;video-resource__source&quot;> - Source:
              <a href=&quot;https://www.cnn.com/&quot; class=&quot;video-resource__source-url&quot;>CNN</a>
  </span>" data-fave-thumbnails="{&quot;big&quot;: { &quot;uri&quot;: &quot;https://media.cnn.com/api/v1/images/stellar/prod/230815125350-split-afghan-women.jpg?c=16x9&amp;q=h_540,w_960,c_fill&quot; }, &quot;small&quot;: { &quot;uri&quot;: &quot;https://media.cnn.com/api/v1/images/stellar/prod/230815125350-split-afghan-women.jpg?c=16x9&amp;q=h_540,w_960,c_fill&quot; }  }" data-vr-video="" data-show-html="<!-- unable to render partial show without a supplied context -->" data-check-event-based-preview="" data-network-id="" data-details="" data-position="14">
          <div>
              <div class="video-resource__image">
                      <div data-uri="cms.cnn.com/_components/image/instances/thumbnail-image-71c0dfdf45925438b3b1698c66db3969@published" class="image image__hide-placeholder" data-image-variation="image" data-name="split afghan women" data-component-name="image" data-observe-resizes="" data-breakpoints="{&quot;image--eq-extra-small&quot;: 115, &quot;image--eq-small&quot;: 300}" data-original-ratio="0.5625" data-original-height="900" data-original-width="1600" data-url="https://media.cnn.com/api/v1/images/stellar/prod/230815125350-split-afghan-women.jpg?c=original" data-unselectable="true">
    
  <div class="image__container " data-image-variation="image" data-breakpoints="{&quot;image--eq-extra-small&quot;: 115, &quot;image--eq-small&quot;: 300, &quot;image--show-credits&quot;: 596}">
     <picture class="image__picture"><img src="https://media.cnn.com/api/v1/images/stellar/prod/230815125350-split-afghan-women.jpg?c=16x9&amp;q=w_250,c_fill" alt="split afghan women" class="image__dam-img image__dam-img--loading" onload="this.classList.remove('image__dam-img--loading')" onerror="imageLoadError(this)" height="900" width="1600" loading="lazy"></picture>
  </div>
  <div class="image__metadata"></div>
  
</div>

              </div>
          </div>
          <div class="ad-feedback-link-container">
              
<div data-ad-type="VIDEO" data-ad-identifier="" class="ad-feedback-link">
  <div class="ad-feedback-link__label">Video Ad Feedback</div>
</div>
          </div>
          <div class="video-resource__details">
              <div data-editable="headline" class="video-resource__headline">CNN speaks to Afghan women about life after two years of Taliban rule</div>
              <div class="video-resource__credit">
                      <span class="video-resource__duration">
                            <svg class="icon-sig-video" width="24" height="24" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="M12 3.333c-4.779 0-8.667 3.888-8.667 8.667S7.221 20.667 12 20.667s8.667-3.888 8.667-8.667S16.779 3.333 12 3.333M12 22C6.486 22 2 17.514 2 12S6.486 2 12 2s10 4.486 10 10-4.486 10-10 10m-1.064-6.793l4.61-2.74a.715.715 0 00-.003-1.23l-4.61-2.712a.714.714 0 00-1.076.616v5.452c0 .554.603.897 1.08.614"></path></svg>

                          05:08
                      </span>
                      <div class="video-resource__label-status">
                          Now playing
                      </div>
                      <span class="video-resource__source"> - Source:
              <a href="https://www.cnn.com/" class="video-resource__source-url">CNN</a>
  </span>
              </div>
          </div>
      </div>

              
                  
              
  
  

<div data-uri="cms.cnn.com/_components/video-resource/instances/h_4b12d74c0710d08388ee84ea6d1873e9-h_064a8f1e60a7f998d33c486251fcbafe@published" data-component-name="video-resource" data-editable="settings" class="video-resource" data-index="idx-11" data-canonical-url-path="/videos/world/2023/08/10/americans-released-from-iranian-prison-house-arrest-deal-amanpour-nc-vpx.cnn" data-video-instance="cms.cnn.com/_components/video-resource/instances/h_4b12d74c0710d08388ee84ea6d1873e9-h_064a8f1e60a7f998d33c486251fcbafe@published" data-video-id="world/2023/08/10/americans-released-from-iranian-prison-house-arrest-deal-amanpour-nc-vpx.cnn" data-live="" data-headline="CNN chief international anchor details deal with Iran that includes release of 5 Americans" data-description="CNN chief international anchor Christiane Amanpour details <a href=&quot;https://www.cnn.com/2023/08/10/politics/americans-released-from-iranian-prison-house-arrest/index.html&quot;>a deal between the United States and Iran</a> that includes the release of five Americans imprisoned in Iran and making $6 billion in frozen Iranian funds more accessible to Tehran in exchange for their return to the US." data-duration="02:00" data-source-html="<span class=&quot;video-resource__source&quot;> - Source:
              <a href=&quot;https://www.cnn.com/&quot; class=&quot;video-resource__source-url&quot;>CNN</a>
  </span>" data-fave-thumbnails="{&quot;big&quot;: { &quot;uri&quot;: &quot;https://media.cnn.com/api/v1/images/stellar/prod/230810121506-americans-wrongfully-detained-iran-split.jpg?c=16x9&amp;q=h_540,w_960,c_fill&quot; }, &quot;small&quot;: { &quot;uri&quot;: &quot;https://media.cnn.com/api/v1/images/stellar/prod/230810121506-americans-wrongfully-detained-iran-split.jpg?c=16x9&amp;q=h_540,w_960,c_fill&quot; }  }" data-vr-video="" data-show-html="<!-- unable to render partial show without a supplied context -->" data-check-event-based-preview="" data-network-id="" data-details="" data-position="15">
          <div>
              <div class="video-resource__image">
                      <div data-uri="cms.cnn.com/_components/image/instances/thumbnail-image-33261be79ab51490f449c41334faa8ec@published" class="image image__hide-placeholder" data-image-variation="image" data-name="americans wrongfully detained iran SPLIT" data-component-name="image" data-observe-resizes="" data-breakpoints="{&quot;image--eq-extra-small&quot;: 115, &quot;image--eq-small&quot;: 300}" data-original-ratio="0.5625" data-original-height="900" data-original-width="1600" data-url="https://media.cnn.com/api/v1/images/stellar/prod/230810121506-americans-wrongfully-detained-iran-split.jpg?c=original" data-unselectable="true">
    
  <div class="image__container " data-image-variation="image" data-breakpoints="{&quot;image--eq-extra-small&quot;: 115, &quot;image--eq-small&quot;: 300, &quot;image--show-credits&quot;: 596}">
     <picture class="image__picture"><img src="https://media.cnn.com/api/v1/images/stellar/prod/230810121506-americans-wrongfully-detained-iran-split.jpg?c=16x9&amp;q=w_250,c_fill" alt="Siamak Namazi, Emad Shargi and Morad Tahbaz" class="image__dam-img image__dam-img--loading" onload="this.classList.remove('image__dam-img--loading')" onerror="imageLoadError(this)" height="900" width="1600" loading="lazy"></picture>
  </div>
  <div class="image__metadata"></div>
  
</div>

              </div>
          </div>
          <div class="ad-feedback-link-container">
              
<div data-ad-type="VIDEO" data-ad-identifier="" class="ad-feedback-link">
  <div class="ad-feedback-link__label">Video Ad Feedback</div>
</div>
          </div>
          <div class="video-resource__details">
              <div data-editable="headline" class="video-resource__headline">CNN chief international anchor details deal with Iran that includes release of 5 Americans</div>
              <div class="video-resource__credit">
                      <span class="video-resource__duration">
                            <svg class="icon-sig-video" width="24" height="24" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="M12 3.333c-4.779 0-8.667 3.888-8.667 8.667S7.221 20.667 12 20.667s8.667-3.888 8.667-8.667S16.779 3.333 12 3.333M12 22C6.486 22 2 17.514 2 12S6.486 2 12 2s10 4.486 10 10-4.486 10-10 10m-1.064-6.793l4.61-2.74a.715.715 0 00-.003-1.23l-4.61-2.712a.714.714 0 00-1.076.616v5.452c0 .554.603.897 1.08.614"></path></svg>

                          02:00
                      </span>
                      <div class="video-resource__label-status">
                          Now playing
                      </div>
                      <span class="video-resource__source"> - Source:
              <a href="https://www.cnn.com/" class="video-resource__source-url">CNN</a>
  </span>
              </div>
          </div>
      </div>

              
                  
              
  
  

<div data-uri="cms.cnn.com/_components/video-resource/instances/h_87010354ffa52527e91791cc63aecbfe-h_064a8f1e60a7f998d33c486251fcbafe@published" data-component-name="video-resource" data-editable="settings" class="video-resource" data-index="idx-12" data-canonical-url-path="/videos/world/2023/08/11/china-flooding-protest-watson-pkg-ebof-vpx.cnn" data-video-instance="cms.cnn.com/_components/video-resource/instances/h_87010354ffa52527e91791cc63aecbfe-h_064a8f1e60a7f998d33c486251fcbafe@published" data-video-id="world/2023/08/11/china-flooding-protest-watson-pkg-ebof-vpx.cnn" data-live="" data-headline="CNN's signal cut in China during flooding report" data-description="CNN's Ivan Watson breaks down the rare protests that erupted in China after flood waters were diverted from Beijing into neighboring provinces." data-duration="03:54" data-source-html="<span class=&quot;video-resource__source&quot;> - Source:
              <a href=&quot;https://www.cnn.com/&quot; class=&quot;video-resource__source-url&quot;>CNN</a>
  </span>" data-fave-thumbnails="{&quot;big&quot;: { &quot;uri&quot;: &quot;https://media.cnn.com/api/v1/images/stellar/prod/230802160130-02-beijing-flooding.jpg?c=16x9&amp;q=h_540,w_960,c_fill&quot; }, &quot;small&quot;: { &quot;uri&quot;: &quot;https://media.cnn.com/api/v1/images/stellar/prod/230802160130-02-beijing-flooding.jpg?c=16x9&amp;q=h_540,w_960,c_fill&quot; }  }" data-vr-video="" data-show-html="<a data-uri=&quot;cms.cnn.com/_components/show/instances/show_4E71F009-862D-73F6-CD76-6FE946F4C52F@published&quot; href=&quot;https://www.cnn.com/shows/erin-burnett-out-front&quot; class=&quot;show show__showlink-url&quot;> Erin Burnett Out Front
  </a>" data-check-event-based-preview="" data-network-id="" data-details="" data-position="16">
          <div>
              <div class="video-resource__image">
                      <div data-uri="cms.cnn.com/_components/image/instances/thumbnail-image-beeb21113b32820daf50bc8918c526a8@published" class="image image__hide-placeholder" data-image-variation="image" data-name="02 beijing flooding" data-component-name="image" data-observe-resizes="" data-breakpoints="{&quot;image--eq-extra-small&quot;: 115, &quot;image--eq-small&quot;: 300}" data-original-ratio="0.6665" data-original-height="1333" data-original-width="2000" data-url="https://media.cnn.com/api/v1/images/stellar/prod/230802160130-02-beijing-flooding.jpg?c=original" data-unselectable="true">
    
  <div class="image__container " data-image-variation="image" data-breakpoints="{&quot;image--eq-extra-small&quot;: 115, &quot;image--eq-small&quot;: 300, &quot;image--show-credits&quot;: 596}">
     <picture class="image__picture"><img src="https://media.cnn.com/api/v1/images/stellar/prod/230802160130-02-beijing-flooding.jpg?c=16x9&amp;q=w_250,c_fill" alt="Residents evacuate on rubber boats through floodwaters in Zhuozhou in northern China's Hebei province, south of Beijing, Wednesday, Aug. 2, 2023. China's capital has recorded its heaviest rainfall in at least 140 years over the past few days. Among the hardest hit areas is Zhuozhou, a small city that borders Beijing's southwest. (AP Photo/Andy Wong)" class="image__dam-img image__dam-img--loading" onload="this.classList.remove('image__dam-img--loading')" onerror="imageLoadError(this)" height="1333" width="2000" loading="lazy"></picture>
  </div>
  <div class="image__metadata"></div>
  
</div>

              </div>
          </div>
          <div class="ad-feedback-link-container">
              
<div data-ad-type="VIDEO" data-ad-identifier="" class="ad-feedback-link">
  <div class="ad-feedback-link__label">Video Ad Feedback</div>
</div>
          </div>
          <div class="video-resource__details">
              <div data-editable="headline" class="video-resource__headline">CNN's signal cut in China during flooding report</div>
              <div class="video-resource__credit">
                      <span class="video-resource__duration">
                            <svg class="icon-sig-video" width="24" height="24" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="M12 3.333c-4.779 0-8.667 3.888-8.667 8.667S7.221 20.667 12 20.667s8.667-3.888 8.667-8.667S16.779 3.333 12 3.333M12 22C6.486 22 2 17.514 2 12S6.486 2 12 2s10 4.486 10 10-4.486 10-10 10m-1.064-6.793l4.61-2.74a.715.715 0 00-.003-1.23l-4.61-2.712a.714.714 0 00-1.076.616v5.452c0 .554.603.897 1.08.614"></path></svg>

                          03:54
                      </span>
                      <div class="video-resource__label-status">
                          Now playing
                      </div>
                      <span class="video-resource__source"> - Source:
              <a href="https://www.cnn.com/" class="video-resource__source-url">CNN</a>
  </span>
              </div>
          </div>
      </div>

              
                  
              
  
  

<div data-uri="cms.cnn.com/_components/video-resource/instances/h_34f5d83738560c3b8ba818f500a6aeff-h_064a8f1e60a7f998d33c486251fcbafe@published" data-component-name="video-resource" data-editable="settings" class="video-resource" data-index="idx-13" data-canonical-url-path="/videos/world/2023/08/10/norway-flooding-home-destroyed-lon-orig-ao.cnn" data-video-instance="cms.cnn.com/_components/video-resource/instances/h_34f5d83738560c3b8ba818f500a6aeff-h_064a8f1e60a7f998d33c486251fcbafe@published" data-video-id="world/2023/08/10/norway-flooding-home-destroyed-lon-orig-ao.cnn" data-live="" data-headline="See mobile home crushed under bridge in Norway floodwaters" data-description="Storm Hans brought extremely heavy rainfall to southern Norway, the region's strongest event in decades." data-duration="00:40" data-source-html="<span class=&quot;video-resource__source&quot;> - Source:
              <a href=&quot;https://www.cnn.com/&quot; class=&quot;video-resource__source-url&quot;>CNN</a>
  </span>" data-fave-thumbnails="{&quot;big&quot;: { &quot;uri&quot;: &quot;https://media.cnn.com/api/v1/images/stellar/prod/230810150746-norway-mobile-home.jpg?c=16x9&amp;q=h_540,w_960,c_fill&quot; }, &quot;small&quot;: { &quot;uri&quot;: &quot;https://media.cnn.com/api/v1/images/stellar/prod/230810150746-norway-mobile-home.jpg?c=16x9&amp;q=h_540,w_960,c_fill&quot; }  }" data-vr-video="" data-show-html="<!-- unable to render partial show without a supplied context -->" data-check-event-based-preview="" data-network-id="" data-details="" data-position="17">
          <div>
              <div class="video-resource__image">
                      <div data-uri="cms.cnn.com/_components/image/instances/thumbnail-image-ab4b8cf78e863c3376cf54f072894824@published" class="image image__hide-placeholder" data-image-variation="image" data-name="norway mobile home" data-component-name="image" data-observe-resizes="" data-breakpoints="{&quot;image--eq-extra-small&quot;: 115, &quot;image--eq-small&quot;: 300}" data-original-ratio="0.5625" data-original-height="1080" data-original-width="1920" data-url="https://media.cnn.com/api/v1/images/stellar/prod/230810150746-norway-mobile-home.jpg?c=original" data-unselectable="true">
    
  <div class="image__container " data-image-variation="image" data-breakpoints="{&quot;image--eq-extra-small&quot;: 115, &quot;image--eq-small&quot;: 300, &quot;image--show-credits&quot;: 596}">
     <picture class="image__picture"><img src="https://media.cnn.com/api/v1/images/stellar/prod/230810150746-norway-mobile-home.jpg?c=16x9&amp;q=w_250,c_fill" alt="norway mobile home" class="image__dam-img image__dam-img--loading" onload="this.classList.remove('image__dam-img--loading')" onerror="imageLoadError(this)" height="1080" width="1920" loading="lazy"></picture>
  </div>
  <div class="image__metadata"></div>
  
</div>

              </div>
          </div>
          <div class="ad-feedback-link-container">
              
<div data-ad-type="VIDEO" data-ad-identifier="" class="ad-feedback-link">
  <div class="ad-feedback-link__label">Video Ad Feedback</div>
</div>
          </div>
          <div class="video-resource__details">
              <div data-editable="headline" class="video-resource__headline">See mobile home crushed under bridge in Norway floodwaters</div>
              <div class="video-resource__credit">
                      <span class="video-resource__duration">
                            <svg class="icon-sig-video" width="24" height="24" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="M12 3.333c-4.779 0-8.667 3.888-8.667 8.667S7.221 20.667 12 20.667s8.667-3.888 8.667-8.667S16.779 3.333 12 3.333M12 22C6.486 22 2 17.514 2 12S6.486 2 12 2s10 4.486 10 10-4.486 10-10 10m-1.064-6.793l4.61-2.74a.715.715 0 00-.003-1.23l-4.61-2.712a.714.714 0 00-1.076.616v5.452c0 .554.603.897 1.08.614"></path></svg>

                          00:40
                      </span>
                      <div class="video-resource__label-status">
                          Now playing
                      </div>
                      <span class="video-resource__source"> - Source:
              <a href="https://www.cnn.com/" class="video-resource__source-url">CNN</a>
  </span>
              </div>
          </div>
      </div>

              
                  
              
  
  

<div data-uri="cms.cnn.com/_components/video-resource/instances/h_70c231a66e65172c9e4968500b4ae24a-h_064a8f1e60a7f998d33c486251fcbafe@published" data-component-name="video-resource" data-editable="settings" class="video-resource" data-index="idx-14" data-canonical-url-path="/videos/world/2023/08/10/ecuador-assassination-fernando-villavicencio-cpt-hnk-vpx.cnn" data-video-instance="cms.cnn.com/_components/video-resource/instances/h_70c231a66e65172c9e4968500b4ae24a-h_064a8f1e60a7f998d33c486251fcbafe@published" data-video-id="world/2023/08/10/ecuador-assassination-fernando-villavicencio-cpt-hnk-vpx.cnn" data-live="" data-headline="Video appears to show moment of the assassination of Ecuador's presidential candidate" data-description="Fernando Villavicencio, an opposition candidate in Ecuador's upcoming Presidential election, <a href=&quot;https://edition.cnn.com/2023/08/09/americas/ecuador-presidential-candidate-fernando-villavicencio-assassinated-intl-hnk/index.html&quot; target=&quot;_blank&quot;>was assassinated</a> at a campaign event, according to Ecuador's President Guillermo Lasso. " data-duration="00:46" data-source-html="<span class=&quot;video-resource__source&quot;> - Source:
              <a href=&quot;https://www.cnn.com/&quot; class=&quot;video-resource__source-url&quot;>CNN</a>
  </span>" data-fave-thumbnails="{&quot;big&quot;: { &quot;uri&quot;: &quot;https://media.cnn.com/api/v1/images/stellar/prod/230809175301-fernando-villavicencio-aug-8.jpg?c=16x9&amp;q=h_540,w_960,c_fill&quot; }, &quot;small&quot;: { &quot;uri&quot;: &quot;https://media.cnn.com/api/v1/images/stellar/prod/230809175301-fernando-villavicencio-aug-8.jpg?c=16x9&amp;q=h_540,w_960,c_fill&quot; }  }" data-vr-video="" data-show-html="<!-- unable to render partial show without a supplied context -->" data-check-event-based-preview="" data-network-id="" data-details="" data-position="18">
          <div>
              <div class="video-resource__image">
                      <div data-uri="cms.cnn.com/_components/image/instances/thumbnail-image-ec346ccca4dc87da7479ad64af6be35b@published" class="image image__hide-placeholder" data-image-variation="image" data-name="Fernando Villavicencio aug 8" data-component-name="image" data-observe-resizes="" data-breakpoints="{&quot;image--eq-extra-small&quot;: 115, &quot;image--eq-small&quot;: 300}" data-original-ratio="0.5625" data-original-height="900" data-original-width="1600" data-url="https://media.cnn.com/api/v1/images/stellar/prod/230809175301-fernando-villavicencio-aug-8.jpg?c=original" data-unselectable="true">
    
  <div class="image__container " data-image-variation="image" data-breakpoints="{&quot;image--eq-extra-small&quot;: 115, &quot;image--eq-small&quot;: 300, &quot;image--show-credits&quot;: 596}">
     <picture class="image__picture"><img src="https://media.cnn.com/api/v1/images/stellar/prod/230809175301-fernando-villavicencio-aug-8.jpg?c=16x9&amp;q=w_250,c_fill" alt="Former Assembly member and now presidential candidate, Fernando Villavicencio, speaks to journalists upon his arrival at the Attorney General's Office in Quito on August 8, 2023. Fernando Villavicencio asked the Attorney General's Office to investigate former officials related to the oil sector of the governments of Rafael Correa, Lenín Moreno, and Guillermo Lasso as part of a criminal complaint that he filed on Tuesday. (Photo by Rodrigo BUENDIA / AFP) (Photo by RODRIGO BUENDIA/AFP via Getty Images)" class="image__dam-img image__dam-img--loading" onload="this.classList.remove('image__dam-img--loading')" onerror="imageLoadError(this)" height="900" width="1600" loading="lazy"></picture>
  </div>
  <div class="image__metadata"></div>
  
</div>

              </div>
          </div>
          <div class="ad-feedback-link-container">
              
<div data-ad-type="VIDEO" data-ad-identifier="" class="ad-feedback-link">
  <div class="ad-feedback-link__label">Video Ad Feedback</div>
</div>
          </div>
          <div class="video-resource__details">
              <div data-editable="headline" class="video-resource__headline">Video appears to show moment of the assassination of Ecuador's presidential candidate</div>
              <div class="video-resource__credit">
                      <span class="video-resource__duration">
                            <svg class="icon-sig-video" width="24" height="24" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="M12 3.333c-4.779 0-8.667 3.888-8.667 8.667S7.221 20.667 12 20.667s8.667-3.888 8.667-8.667S16.779 3.333 12 3.333M12 22C6.486 22 2 17.514 2 12S6.486 2 12 2s10 4.486 10 10-4.486 10-10 10m-1.064-6.793l4.61-2.74a.715.715 0 00-.003-1.23l-4.61-2.712a.714.714 0 00-1.076.616v5.452c0 .554.603.897 1.08.614"></path></svg>

                          00:46
                      </span>
                      <div class="video-resource__label-status">
                          Now playing
                      </div>
                      <span class="video-resource__source"> - Source:
              <a href="https://www.cnn.com/" class="video-resource__source-url">CNN</a>
  </span>
              </div>
          </div>
      </div>

    <div data-uri="cms.cnn.com/_components/video-resource/instances/h_8a01825b2fe5267c6277dcac7d3552d4-h_ba74c952f5f3ac3a094a726d0c92d828-pageTop@published" data-component-name="video-resource" data-editable="settings" class="video-resource" data-index="idx-0" data-canonical-url-path="/videos/business/2023/08/18/china-economy-impact-rest-of-the-world-simon-baptist-sot-ovn-hnk-vpx.cnn" data-video-instance="cms.cnn.com/_components/video-resource/instances/h_8a01825b2fe5267c6277dcac7d3552d4-h_ba74c952f5f3ac3a094a726d0c92d828-pageTop@published" data-video-id="business/2023/08/18/china-economy-impact-rest-of-the-world-simon-baptist-sot-ovn-hnk-vpx.cnn" data-live="" data-headline="Hear how China's economic slowdown could hurt and benefit other countries" data-description="Simon Baptist, Chief Economist of the Economist Intelligence Unit, joins CNN's Michael Holmes to discuss how China's economic slowdown could impact the rest of the world. " data-duration="01:27" data-source-html="<span class=&quot;video-resource__source&quot;> - Source:
              <a href=&quot;https://www.cnn.com/&quot; class=&quot;video-resource__source-url&quot;>CNN</a>
  </span>" data-fave-thumbnails="{&quot;big&quot;: { &quot;uri&quot;: &quot;https://media.cnn.com/api/v1/images/stellar/prod/230818135614-screengrab-simon-baptist.jpg?c=16x9&amp;q=h_540,w_960,c_fill&quot; }, &quot;small&quot;: { &quot;uri&quot;: &quot;https://media.cnn.com/api/v1/images/stellar/prod/230818135614-screengrab-simon-baptist.jpg?c=16x9&amp;q=h_540,w_960,c_fill&quot; }  }" data-vr-video="" data-show-html="<!-- unable to render partial show without a supplied context -->" data-check-event-based-preview="" data-network-id="" data-details="" data-position="19">
          <div>
              <div class="video-resource__image">
                      <div data-uri="cms.cnn.com/_components/image/instances/thumbnail-image-3abdd24fad6a43520187126a5cfca0fc@published" class="image image__hide-placeholder" data-image-variation="image" data-name="screengrab simon baptist" data-component-name="image" data-observe-resizes="" data-breakpoints="{&quot;image--eq-extra-small&quot;: 115, &quot;image--eq-small&quot;: 300}" data-original-ratio="0.5625" data-original-height="1080" data-original-width="1920" data-url="https://media.cnn.com/api/v1/images/stellar/prod/230818135614-screengrab-simon-baptist.jpg?c=original" data-unselectable="true">
    
  <div class="image__container " data-image-variation="image" data-breakpoints="{&quot;image--eq-extra-small&quot;: 115, &quot;image--eq-small&quot;: 300, &quot;image--show-credits&quot;: 596}">
     <picture class="image__picture"><img src="https://media.cnn.com/api/v1/images/stellar/prod/230818135614-screengrab-simon-baptist.jpg?c=16x9&amp;q=w_250,c_fill" alt="screengrab simon baptist" class="image__dam-img" onload="this.classList.remove('image__dam-img--loading')" onerror="imageLoadError(this)" height="1080" width="1920"></picture>
  </div>
  <div class="image__metadata"></div>
  
</div>

              </div>
          </div>
          <div class="ad-feedback-link-container">
              
<div data-ad-type="VIDEO" data-ad-identifier="" class="ad-feedback-link">
  <div class="ad-feedback-link__label">Video Ad Feedback</div>
</div>
          </div>
          <div class="video-resource__details">
              <div data-editable="headline" class="video-resource__headline">Hear how China's economic slowdown could hurt and benefit other countries</div>
              <div class="video-resource__credit">
                      <span class="video-resource__duration">
                            <svg class="icon-sig-video" width="24" height="24" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="M12 3.333c-4.779 0-8.667 3.888-8.667 8.667S7.221 20.667 12 20.667s8.667-3.888 8.667-8.667S16.779 3.333 12 3.333M12 22C6.486 22 2 17.514 2 12S6.486 2 12 2s10 4.486 10 10-4.486 10-10 10m-1.064-6.793l4.61-2.74a.715.715 0 00-.003-1.23l-4.61-2.712a.714.714 0 00-1.076.616v5.452c0 .554.603.897 1.08.614"></path></svg>

                          01:27
                      </span>
                      <div class="video-resource__label-status">
                          Now playing
                      </div>
                      <span class="video-resource__source"> - Source:
              <a href="https://www.cnn.com/" class="video-resource__source-url">CNN</a>
  </span>
              </div>
          </div>
      </div><div data-uri="cms.cnn.com/_components/video-resource/instances/h_f2504ec54719b0f1d6ab48e278efa5f8-h_064a8f1e60a7f998d33c486251fcbafe@published" data-component-name="video-resource" data-editable="settings" class="video-resource" data-index="idx-1" data-canonical-url-path="/videos/world/2023/08/18/tenerife-wildfire-satellite-images-lon-orig-cw.cnn" data-video-instance="cms.cnn.com/_components/video-resource/instances/h_f2504ec54719b0f1d6ab48e278efa5f8-h_064a8f1e60a7f998d33c486251fcbafe@published" data-video-id="world/2023/08/18/tenerife-wildfire-satellite-images-lon-orig-cw.cnn" data-live="" data-headline="Satellite images show scale of wildfires in Tenerife" data-description="More than 3000 people have been evacuated amid spreading wildfires on the Spanish Canary Island of Tenerife, which have already burned around 6,424 acres of land. " data-duration="00:59" data-source-html="<span class=&quot;video-resource__source&quot;> - Source:
              <a href=&quot;https://www.cnn.com/&quot; class=&quot;video-resource__source-url&quot;>CNN</a>
  </span>" data-fave-thumbnails="{&quot;big&quot;: { &quot;uri&quot;: &quot;https://media.cnn.com/api/v1/images/stellar/prod/230818143433-tenerife-wildfires.jpg?c=16x9&amp;q=h_540,w_960,c_fill&quot; }, &quot;small&quot;: { &quot;uri&quot;: &quot;https://media.cnn.com/api/v1/images/stellar/prod/230818143433-tenerife-wildfires.jpg?c=16x9&amp;q=h_540,w_960,c_fill&quot; }  }" data-vr-video="" data-show-html="<!-- unable to render partial show without a supplied context -->" data-check-event-based-preview="" data-network-id="" data-details="" data-position="20">
          <div>
              <div class="video-resource__image">
                      <div data-uri="cms.cnn.com/_components/image/instances/thumbnail-image-bcb656482f2c4f666fac9f7df2cb4988@published" class="image image__hide-placeholder" data-image-variation="image" data-name="Tenerife wildfires" data-component-name="image" data-observe-resizes="" data-breakpoints="{&quot;image--eq-extra-small&quot;: 115, &quot;image--eq-small&quot;: 300}" data-original-ratio="0.5625" data-original-height="1080" data-original-width="1920" data-url="https://media.cnn.com/api/v1/images/stellar/prod/230818143433-tenerife-wildfires.jpg?c=original" data-unselectable="true">
    
  <div class="image__container " data-image-variation="image" data-breakpoints="{&quot;image--eq-extra-small&quot;: 115, &quot;image--eq-small&quot;: 300, &quot;image--show-credits&quot;: 596}">
     <picture class="image__picture"><img src="https://media.cnn.com/api/v1/images/stellar/prod/230818143433-tenerife-wildfires.jpg?c=16x9&amp;q=w_250,c_fill" alt="Tenerife wildfires" class="image__dam-img" onload="this.classList.remove('image__dam-img--loading')" onerror="imageLoadError(this)" height="1080" width="1920"></picture>
  </div>
  <div class="image__metadata"></div>
  
</div>

              </div>
          </div>
          <div class="ad-feedback-link-container">
              
<div data-ad-type="VIDEO" data-ad-identifier="" class="ad-feedback-link">
  <div class="ad-feedback-link__label">Video Ad Feedback</div>
</div>
          </div>
          <div class="video-resource__details">
              <div data-editable="headline" class="video-resource__headline">Satellite images show scale of wildfires in Tenerife</div>
              <div class="video-resource__credit">
                      <span class="video-resource__duration">
                            <svg class="icon-sig-video" width="24" height="24" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="M12 3.333c-4.779 0-8.667 3.888-8.667 8.667S7.221 20.667 12 20.667s8.667-3.888 8.667-8.667S16.779 3.333 12 3.333M12 22C6.486 22 2 17.514 2 12S6.486 2 12 2s10 4.486 10 10-4.486 10-10 10m-1.064-6.793l4.61-2.74a.715.715 0 00-.003-1.23l-4.61-2.712a.714.714 0 00-1.076.616v5.452c0 .554.603.897 1.08.614"></path></svg>

                          00:59
                      </span>
                      <div class="video-resource__label-status">
                          Now playing
                      </div>
                      <span class="video-resource__source"> - Source:
              <a href="https://www.cnn.com/" class="video-resource__source-url">CNN</a>
  </span>
              </div>
          </div>
      </div><div data-uri="cms.cnn.com/_components/video-resource/instances/h_c91deaa3f9432afa27ead78c3c1db2e5-h_064a8f1e60a7f998d33c486251fcbafe@published" data-component-name="video-resource" data-editable="settings" class="video-resource" data-index="idx-2" data-canonical-url-path="/videos/world/2023/08/18/canada-wildfires-yellowknife-evacuations-newton-nc-vpx.cnn" data-video-instance="cms.cnn.com/_components/video-resource/instances/h_c91deaa3f9432afa27ead78c3c1db2e5-h_064a8f1e60a7f998d33c486251fcbafe@published" data-video-id="world/2023/08/18/canada-wildfires-yellowknife-evacuations-newton-nc-vpx.cnn" data-live="" data-headline="Entire city of Yellowknife forced to evacuate as fires rage" data-description="Thousands of Yellowknife residents have been <a href=&quot;https://www.cnn.com/2023/08/18/americas/canada-northwest-territories-wildfire-evacuation-friday/index.html&quot; target=&quot;_blank&quot;>ordered to evacuate</a> as crews battle wildfires in the Northwest Territories of Canada. CNN's Paula Newton reports." data-duration="01:55" data-source-html="<span class=&quot;video-resource__source&quot;> - Source:
              <a href=&quot;https://www.cnn.com/&quot; class=&quot;video-resource__source-url&quot;>CNN</a>
  </span>" data-fave-thumbnails="{&quot;big&quot;: { &quot;uri&quot;: &quot;https://media.cnn.com/api/v1/images/stellar/prod/230818142510-yellowknife-wildfire.jpg?c=16x9&amp;q=h_540,w_960,c_fill&quot; }, &quot;small&quot;: { &quot;uri&quot;: &quot;https://media.cnn.com/api/v1/images/stellar/prod/230818142510-yellowknife-wildfire.jpg?c=16x9&amp;q=h_540,w_960,c_fill&quot; }  }" data-vr-video="" data-show-html="<!-- unable to render partial show without a supplied context -->" data-check-event-based-preview="" data-network-id="" data-details="" data-position="21">
          <div>
              <div class="video-resource__image">
                      <div data-uri="cms.cnn.com/_components/image/instances/thumbnail-image-a2c5a82ca28a86ceee225db0cc5228ed@published" class="image image__hide-placeholder" data-image-variation="image" data-name="yellowknife wildfire" data-component-name="image" data-observe-resizes="" data-breakpoints="{&quot;image--eq-extra-small&quot;: 115, &quot;image--eq-small&quot;: 300}" data-original-ratio="0.5625" data-original-height="1080" data-original-width="1920" data-url="https://media.cnn.com/api/v1/images/stellar/prod/230818142510-yellowknife-wildfire.jpg?c=original" data-unselectable="true">
    
  <div class="image__container " data-image-variation="image" data-breakpoints="{&quot;image--eq-extra-small&quot;: 115, &quot;image--eq-small&quot;: 300, &quot;image--show-credits&quot;: 596}">
     <picture class="image__picture"><img src="https://media.cnn.com/api/v1/images/stellar/prod/230818142510-yellowknife-wildfire.jpg?c=16x9&amp;q=w_250,c_fill" alt="yellowknife wildfire" class="image__dam-img" onload="this.classList.remove('image__dam-img--loading')" onerror="imageLoadError(this)" height="1080" width="1920"></picture>
  </div>
  <div class="image__metadata"></div>
  
</div>

              </div>
          </div>
          <div class="ad-feedback-link-container">
              
<div data-ad-type="VIDEO" data-ad-identifier="" class="ad-feedback-link">
  <div class="ad-feedback-link__label">Video Ad Feedback</div>
</div>
          </div>
          <div class="video-resource__details">
              <div data-editable="headline" class="video-resource__headline">Entire city of Yellowknife forced to evacuate as fires rage</div>
              <div class="video-resource__credit">
                      <span class="video-resource__duration">
                            <svg class="icon-sig-video" width="24" height="24" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="M12 3.333c-4.779 0-8.667 3.888-8.667 8.667S7.221 20.667 12 20.667s8.667-3.888 8.667-8.667S16.779 3.333 12 3.333M12 22C6.486 22 2 17.514 2 12S6.486 2 12 2s10 4.486 10 10-4.486 10-10 10m-1.064-6.793l4.61-2.74a.715.715 0 00-.003-1.23l-4.61-2.712a.714.714 0 00-1.076.616v5.452c0 .554.603.897 1.08.614"></path></svg>

                          01:55
                      </span>
                      <div class="video-resource__label-status">
                          Now playing
                      </div>
                      <span class="video-resource__source"> - Source:
              <a href="https://www.cnn.com/" class="video-resource__source-url">CNN</a>
  </span>
              </div>
          </div>
      </div><div data-uri="cms.cnn.com/_components/video-resource/instances/h_957de46119e0c8aa77246068dd309ba1-h_064a8f1e60a7f998d33c486251fcbafe@published" data-component-name="video-resource" data-editable="settings" class="video-resource" data-index="idx-3" data-canonical-url-path="/videos/world/2023/08/17/north-korea-icbm-weapon-intelligence-pkg-ripley-lead-vpx.cnn" data-video-instance="cms.cnn.com/_components/video-resource/instances/h_957de46119e0c8aa77246068dd309ba1-h_064a8f1e60a7f998d33c486251fcbafe@published" data-video-id="world/2023/08/17/north-korea-icbm-weapon-intelligence-pkg-ripley-lead-vpx.cnn" data-live="" data-headline="See the new weapon North Korea may test soon" data-description="CNN's Will Ripley breaks down new South Korean intelligence that North Korea may be preparing to test a new intercontinental ballistic missile." data-duration="02:07" data-source-html="<span class=&quot;video-resource__source&quot;> - Source:
              <a href=&quot;https://www.cnn.com/&quot; class=&quot;video-resource__source-url&quot;>CNN</a>
  </span>" data-fave-thumbnails="{&quot;big&quot;: { &quot;uri&quot;: &quot;https://media.cnn.com/api/v1/images/stellar/prod/230817172419-north-korea-icbm.jpg?c=16x9&amp;q=h_540,w_960,c_fill&quot; }, &quot;small&quot;: { &quot;uri&quot;: &quot;https://media.cnn.com/api/v1/images/stellar/prod/230817172419-north-korea-icbm.jpg?c=16x9&amp;q=h_540,w_960,c_fill&quot; }  }" data-vr-video="" data-show-html="<a data-uri=&quot;cms.cnn.com/_components/show/instances/show_00E11A3E-A80E-6443-B504-FFF32537C2F7@published&quot; href=&quot;https://www.cnn.com/shows/the-lead&quot; class=&quot;show show__showlink-url&quot;> The Lead
  </a>" data-check-event-based-preview="" data-network-id="" data-details="" data-position="22">
          <div>
              <div class="video-resource__image">
                      <div data-uri="cms.cnn.com/_components/image/instances/thumbnail-image-d05806dc134629abaf5c073f1fbed7a8@published" class="image image__hide-placeholder" data-image-variation="image" data-name="north korea icbm" data-component-name="image" data-observe-resizes="" data-breakpoints="{&quot;image--eq-extra-small&quot;: 115, &quot;image--eq-small&quot;: 300}" data-original-ratio="0.5625" data-original-height="1080" data-original-width="1920" data-url="https://media.cnn.com/api/v1/images/stellar/prod/230817172419-north-korea-icbm.jpg?c=original" data-unselectable="true">
    
  <div class="image__container " data-image-variation="image" data-breakpoints="{&quot;image--eq-extra-small&quot;: 115, &quot;image--eq-small&quot;: 300, &quot;image--show-credits&quot;: 596}">
     <picture class="image__picture"><img src="https://media.cnn.com/api/v1/images/stellar/prod/230817172419-north-korea-icbm.jpg?c=16x9&amp;q=w_250,c_fill" alt="north korea icbm" class="image__dam-img" onload="this.classList.remove('image__dam-img--loading')" onerror="imageLoadError(this)" height="1080" width="1920"></picture>
  </div>
  <div class="image__metadata"></div>
  
</div>

              </div>
          </div>
          <div class="ad-feedback-link-container">
              
<div data-ad-type="VIDEO" data-ad-identifier="" class="ad-feedback-link">
  <div class="ad-feedback-link__label">Video Ad Feedback</div>
</div>
          </div>
          <div class="video-resource__details">
              <div data-editable="headline" class="video-resource__headline">See the new weapon North Korea may test soon</div>
              <div class="video-resource__credit">
                      <span class="video-resource__duration">
                            <svg class="icon-sig-video" width="24" height="24" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="M12 3.333c-4.779 0-8.667 3.888-8.667 8.667S7.221 20.667 12 20.667s8.667-3.888 8.667-8.667S16.779 3.333 12 3.333M12 22C6.486 22 2 17.514 2 12S6.486 2 12 2s10 4.486 10 10-4.486 10-10 10m-1.064-6.793l4.61-2.74a.715.715 0 00-.003-1.23l-4.61-2.712a.714.714 0 00-1.076.616v5.452c0 .554.603.897 1.08.614"></path></svg>

                          02:07
                      </span>
                      <div class="video-resource__label-status">
                          Now playing
                      </div>
                      <span class="video-resource__source"> - Source:
              <a href="https://www.cnn.com/" class="video-resource__source-url">CNN</a>
  </span>
              </div>
          </div>
      </div></div>
  </div>
  <button class="video-playlist__show-more">See More Videos</button>
  <div class="video-playlist__navigation">
    <span class="video-playlist__navigation--previous">
      <svg class="icon-ui-arrow-left" width="24" height="24" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="M2.203 12.064l7.854 7.875c.271.272.71.272.982 0a.698.698 0 000-.985l-6.622-6.697H21.31c.529 0 .69-.338.69-.655 0-.356-.284-.716-.69-.716H4.414l6.625-6.698a.698.698 0 000-.984.693.693 0 00-.982 0l-7.854 7.875a.698.698 0 000 .985"></path></svg>

    </span>
    <span class="video-playlist__navigation--next">
      <svg class="icon-ui-arrow-right" width="24" height="24" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="M21.797 12.063l-7.854 7.876a.693.693 0 01-.982 0 .697.697 0 010-.985l6.622-6.697H2.69c-.529 0-.69-.339-.69-.655 0-.356.284-.716.69-.716h16.896l-6.625-6.698a.697.697 0 010-.984.693.693 0 01.982 0l7.854 7.875a.697.697 0 010 .984"></path></svg>

    </span>
  </div>
</div>
</div>

      <div data-editable="playlist"></div>
  </div>
</div>

              </div>
          <div class="article__content-container">
              <div class="article__content" data-editable="content" itemprop="articleBody" data-reorderable="content">
                  <div data-uri="cms.cnn.com/_components/source/instances/source-h_ba74c952f5f3ac3a094a726d0c92d828@published" class="source inline-placeholder">
  <cite class="source__cite">
    <span class="source__location" data-editable="location">Hong Kong</span>
    <span class="source__text" data-editable="source">CNN</span>
      &nbsp;—&nbsp;
  </cite>
</div>

<p class="paragraph inline-placeholder" data-uri="cms.cnn.com/_components/paragraph/instances/paragraph_3A1929CB-A8AB-236E-CA41-1582D7839B4B@published" data-editable="text" data-component-name="paragraph" data-analytics-observe="on">
    China has long been the engine of global growth.
</p>

<p class="paragraph inline-placeholder" data-uri="cms.cnn.com/_components/paragraph/instances/paragraph_D014D1BB-199C-8312-A567-17095584B018@published" data-editable="text" data-component-name="paragraph" data-analytics-observe="on">
    But in recent weeks, its <a href="https://www.cnn.com/2023/08/06/economy/china-economy-stimulus-limited-options-intl-hnk/index.html" target="_blank">economic slowdown</a> has alarmed international leaders and investors who are no longer counting on it to be a bulwark against weakness elsewhere. In fact, for the first time in decades, the world’s second economy is itself the problem.
</p>

<p class="paragraph inline-placeholder" data-uri="cms.cnn.com/_components/paragraph/instances/paragraph_77FC0EA9-FA8D-DEA0-E742-173416E0E30B@published" data-editable="text" data-component-name="paragraph" data-analytics-observe="on">
    Hong Kong’s Hang Seng
          <a href="https://money.cnn.com/data/world_markets/hang_seng/?source=story_quote_link">
              (HSI)</a> Index slid into a bear market on Friday, having fallen more than 20% from its recent peak in January. Last week, the Chinese yuan fell to its lowest level in 16 years, prompting the central bank to make its biggest defense of the currency on record by setting a much higher rate to the dollar than the estimated market value.
</p><div data-uri="cms.cnn.com/_components/ad-slot-dynamic/instances/sharethrough@published" class="ad-slot-dynamic ad-slot-dynamic--1" data-placement="{&quot;mobile&quot;:{&quot;position&quot;:5},&quot;desktop&quot;:{&quot;position&quot;:3}}" data-unselectable="true">
      <div data-uri="cms.cnn.com/_components/ad-slot/instances/cnn-v1@published" class="ad-slot" data-path="end/ad-slot-dynamic[0]/items" data-desktop-slot-id="ad_nat_btf_01" data-mobile-slot-id="ad_nat_btf_01" data-unselectable="true"><div id="ad_nat_btf_01" class="ad" style="display: none;"></div>
      <div class="ad-slot__feedback ad-feedback-link-container">
          <div class="ad-slot__ad-label"></div>
           
<div data-ad-type="DISPLAY" data-ad-identifier="ad_nat_btf_01" class="ad-feedback-link">
  <div class="ad-feedback-link__label">Ad Feedback</div>
</div>
          
      </div>
  </div>

  </div>

<p class="paragraph inline-placeholder" data-uri="cms.cnn.com/_components/paragraph/instances/paragraph_17C44C6B-DB4E-DE47-55E5-17094DF7D27C@published" data-editable="text" data-component-name="paragraph" data-analytics-observe="off">
    The issue is that, after a rapid spurt of activity earlier this year following the lifting of Covid lockdowns, growth is stalling. Consumer prices are falling, a real estate crisis is deepening and exports are in a slump. Unemployment among youth has gotten so bad the government has stopped publishing the data.
</p>

<p class="paragraph inline-placeholder" data-uri="cms.cnn.com/_components/paragraph/instances/paragraph_1F3279FD-6AD9-1426-BAE2-15FDF58D942B@published" data-editable="text" data-component-name="paragraph" data-analytics-observe="off">
    To make things worse, <a href="https://www.cnn.com/2023/08/14/economy/china-country-garden-onshore-bonds-suspension-intl-hnk/index.html" target="_blank">a major homebuilder</a> and <a href="https://www.cnn.com/2023/08/18/economy/china-zhongrong-trust-protest-intl-hnk/index.html" target="_blank">a prominent investment company</a> have missed payments to their investors in recent weeks, rekindling fears that the <a href="https://www.cnn.com/2023/08/01/economy/china-real-estate-country-garden-intl-hnk/index.html" target="_blank">ongoing deterioration of the housing market</a> could lead to heightened risks to financial stability.
</p>

<p class="paragraph inline-placeholder" data-uri="cms.cnn.com/_components/paragraph/instances/paragraph_5A15A344-099D-A2CE-DA08-16106C9864D7@published" data-editable="text" data-component-name="paragraph" data-analytics-observe="off">
    A lack of resolute measures to stimulate domestic demand and fears of contagion have triggered a new round of growth downgrades, with several major investment banks cutting their forecasts of China’s economic growth to below 5%. 
</p><div data-uri="cms.cnn.com/_components/ad-slot-dynamic/instances/outstream@published" class="ad-slot-dynamic ad-slot-dynamic--1" data-placement="{&quot;mobile&quot;:{&quot;position&quot;:7},&quot;desktop&quot;:{&quot;position&quot;:6}}" data-unselectable="true">
      <div class="ad-slot-dynamic__close"></div>
      <div data-uri="cms.cnn.com/_components/ad-slot/instances/cnn-v1@published" class="ad-slot" data-path="end/ad-slot-dynamic[1]/items" data-desktop-slot-id="ad_out_vid_01" data-mobile-slot-id="ad_out_vid_01" data-unselectable="true"><div id="ad_out_vid_01" class="ad" style="display: none;"></div>
      <div class="ad-slot__feedback ad-feedback-link-container">
          <div class="ad-slot__ad-label"></div>
           
<div data-ad-type="DISPLAY" data-ad-identifier="ad_out_vid_01" class="ad-feedback-link">
  <div class="ad-feedback-link__label">Ad Feedback</div>
</div>
          
      </div>
  </div>

  </div>

<div data-uri="cms.cnn.com/_components/image/instances/image-48c8cda3fe4b6a1e2a44f436a4f6055d@published" class="image image__hide-placeholder image--eq-extra-small image--eq-small" data-image-variation="image" data-name="shanghai economy 080723" data-component-name="image" data-observe-resizes="" data-breakpoints="{&quot;image--eq-extra-small&quot;: 115, &quot;image--eq-small&quot;: 300}" data-original-ratio="0.666875" data-original-height="1067" data-original-width="1600" data-url="https://media.cnn.com/api/v1/images/stellar/prod/230821154721-shanghai-economy-080723.jpg?c=original" data-editable="settings">
    
  <div class="image__container " data-image-variation="image" data-breakpoints="{&quot;image--eq-extra-small&quot;: 115, &quot;image--eq-small&quot;: 300, &quot;image--show-credits&quot;: 596}">
     <picture class="image__picture"><source height="720" width="1280" media="(min-width: 1280px)" srcset="https://media.cnn.com/api/v1/images/stellar/prod/230821154721-shanghai-economy-080723.jpg?c=16x9&amp;q=h_720,w_1280,c_fill/f_webp" type="image/webp"><source height="540" width="960" media="(min-width: 960px)" srcset="https://media.cnn.com/api/v1/images/stellar/prod/230821154721-shanghai-economy-080723.jpg?c=16x9&amp;q=h_540,w_960,c_fill/f_webp" type="image/webp"><source height="270" width="480" media="(-webkit-min-device-pixel-ratio: 2)" srcset="https://media.cnn.com/api/v1/images/stellar/prod/230821154721-shanghai-economy-080723.jpg?c=16x9&amp;q=h_270,w_480,c_fill/f_webp" type="image/webp"><img src="https://media.cnn.com/api/v1/images/stellar/prod/230821154721-shanghai-economy-080723.jpg?c=16x9&amp;q=h_720,w_1280,c_fill" alt="A skyline of Shanghai, China's financial capital, captured on August 7" class="image__dam-img" onload="this.classList.remove('image__dam-img--loading')" onerror="imageLoadError(this)" height="1067" width="1600" loading="lazy"></picture>
  </div>
  
    <div class="image__metadata">
      <div itemprop="caption" class="image__caption attribution">

<span data-editable="metaCaption" class="inline-placeholder">A skyline of Shanghai, China's financial capital, captured on August 7</span>

</div>
      <figcaption class="image__credit">Ying Tang/NurPhoto/Getty Images</figcaption>
    </div>
  
</div>


<p class="paragraph inline-placeholder" data-uri="cms.cnn.com/_components/paragraph/instances/paragraph_5BD34E47-02F5-88C4-4D3D-16106E25567E@published" data-editable="text" data-component-name="paragraph" data-analytics-observe="on">
    “We downgrade China’s real GDP growth forecast … as the property downturn has deepened, external demand has weakened further, and policy support has been less than expected,” UBS analysts wrote in a Monday research note. 
</p>

<p class="paragraph inline-placeholder" data-uri="cms.cnn.com/_components/paragraph/instances/paragraph_E3D7011F-66D7-004C-8597-16F8F4F02D08@published" data-editable="text" data-component-name="paragraph" data-analytics-observe="on">
    Researchers at Nomura, Morgan Stanley and Barclays had previously trimmed their forecasts.
</p>

<p class="paragraph inline-placeholder" data-uri="cms.cnn.com/_components/paragraph/instances/paragraph_955286BF-A52A-131D-E470-163987C4DDF2@published" data-editable="text" data-component-name="paragraph" data-analytics-observe="on">
    That means China might significantly miss its official growth target of “around 5.5%,” which would be an embarrassment for the Chinese leadership under President Xi Jinping.
</p>

<p class="paragraph inline-placeholder" data-uri="cms.cnn.com/_components/paragraph/instances/paragraph_94AB6815-5EAF-0E61-BA64-16FD90B9B5D9@published" data-editable="text" data-component-name="paragraph" data-analytics-observe="on">
    It’s a far cry from global financial meltdown of 2008, when China launched the largest stimulus package in the world and was the first major economy to emerge from the crisis. It’s also a reversal from the early days of the pandemic, when China was <a href="https://www.cnn.com/2020/10/10/economy/china-global-economy-intl-hnk/index.html" target="_blank">the only major developed economy</a> to dodge a recession. So what’s gone wrong?
</p>

<h2 class="subheader" data-editable="text" data-uri="cms.cnn.com/_components/subheader/instances/paragraph_74E8A9A3-21FE-767D-D920-16427F8AF63A@published" data-component-name="subheader" id="property-woes">
  Property woes
</h2>

<p class="paragraph inline-placeholder" data-uri="cms.cnn.com/_components/paragraph/instances/paragraph_112E8FC9-0388-31E2-160B-1712C87919C7@published" data-editable="text" data-component-name="paragraph" data-analytics-observe="on">
    China’s economy has been in doldrums since April, when momentum from a <a href="https://www.cnn.com/2023/04/17/economy/china-gdp-q1-2023-intl-hnk/index.html" target="_blank">strong start</a> to the year faded. But concerns have intensified this month following defaults by Country Garden, once the country’s largest developer by property sales, and Zhongrong Trust, a top trust company.
</p>

<div class="bxc bx-base bx-custom bx-active-step-1 bx-campaign-2006209 bx-brand-29145 bx-width-default bx-type-agilityzone bx-has-close-x-1 bx-has-close-inside bx-fx-fade" id="bx-campaign-2006209" style="display: none; visibility: hidden; margin-top: 0px; margin-left: 0px; margin-bottom: 2%;" aria-hidden="true" aria-labelledby="bx-campaign-ally-title-2006209"><div id="bx-shroud-2006209" class="bx-matte bx-shroud bx-shroud-2006209"></div><div id="bx-hover-shroud-2006209" class="bx-hover-shroud bx-hover-shroud-2006209" style="display:none"></div><div class="bx-slab"><div class="bx-align"><div class="bx-creative bx-creative-2006209" id="bx-creative-2006209"><div class="bx-wrap"><div id="bx-campaign-ally-title-2006209" class="bx-ally-title">Enter your email to subscribe to the CNN Business Newsletter.</div><a id="bx-close-inside-2006209" class="bx-close bx-close-link bx-close-inside" data-click="close" href="javascript:void(0)"><svg class="bx-close-xsvg" viewBox="240 240 20 20" aria-hidden="true"><g class="bx-close-xstroke bx-close-x-adaptive"><path class="bx-close-x-adaptive-1" d="M255.6 255.6l-11.2-11.2" vector-effect="non-scaling-stroke"></path><path class="bx-close-x-adaptive-2" d="M255.6 244.4l-11.2 11.2" vector-effect="non-scaling-stroke"></path></g></svg><div class="bx-ally-label">close dialog</div></a><div class="bx-step bx-step-1 bx-active-step bx-step-RITNZaZ bx-step-2006209-1 bx-tail-placement-hidden" id="bx-step-2006209-1" data-close-placement="inside"><form id="bx-form-2006209-step-1" bx-novalidate="true" method="post" action="https://api.bounceexchange.com/capture/submit" onsubmit="return bouncex.submitCampaignStep(2006209); return false" onreset="bouncex.close_ad(2006209); return false" tabindex="0" aria-labelledby="bx-campaign-ally-title-2006209"><input type="hidden" name="campaign_id" value="2006209"><div class="bx-group bx-group-default bx-group-2006209-478Av0E bx-group-478Av0E" id="bx-group-2006209-478Av0E"><div class="bx-row bx-row-image bx-row-image-default  bx-row-GnNg8zY bx-element-2006209-GnNg8zY" id="bx-element-2006209-GnNg8zY"><img src="//assets.bounceexchange.com/assets/uploads/clients/340/creatives/95e926ddff4057b5953d3091ed881688.png" alt="CNN Business Before the Bell"></div></div><div class="bx-group bx-group-primary bx-group-2006209-ZWUw1PY bx-group-ZWUw1PY" id="bx-group-2006209-ZWUw1PY"><div class="bx-row bx-row-image bx-row-image-default  bx-row-7iyD9gg bx-element-2006209-7iyD9gg" id="bx-element-2006209-7iyD9gg"><img src="//assets.bounceexchange.com/assets/uploads/clients/340/creatives/08b4405a08b7c5d4f38362368edcc721.png" alt="before markets open start your day smart"></div><div class="bx-row bx-row-text bx-row-text-subheadline  bx-row-DSUWecj bx-element-2006209-DSUWecj" id="bx-element-2006209-DSUWecj"><div>Get essential news and analysis on global markets with CNN Business’ daily newsletter. </div></div></div><div class="bx-group bx-group-default bx-group-2006209-wUDoY4p bx-group-wUDoY4p" id="bx-group-2006209-wUDoY4p"><div class="bx-row bx-row-submit bx-row-submit-default  bx-row-GXSXxmX bx-element-2006209-GXSXxmX" id="bx-element-2006209-GXSXxmX"><button type="submit" class="bx-button" data-click="submit" data-step-delay="0" data-submit-jump="0" data-submit-force="0" data-click-report="nothing">Sign me up</button></div><div class="bx-row bx-row-submit bx-row-submit-no  bx-row-EvIbRnF bx-element-2006209-EvIbRnF" id="bx-element-2006209-EvIbRnF"><button type="reset" class="bx-button" data-click="close">No, thanks</button></div><div class="bx-row bx-row-text bx-row-text-sosumi  bx-row-fOVTXdl bx-element-2006209-fOVTXdl" id="bx-element-2006209-fOVTXdl"><div>By subscribing you agree to our</div></div><div class="bx-row bx-row-text bx-row-text-sosumi  bx-row-rXnlSnx bx-element-2006209-rXnlSnx" id="bx-element-2006209-rXnlSnx"><a href="https://www.cnn.com/privacy0?no-st=9999999999" target="_blank" class="" data-click="hyperlink" data-click-report="nothing"><div>privacy policy.</div></a></div></div><div class="bx-group bx-group-default bx-group-2006209-05RwfFk bx-group-05RwfFk" id="bx-group-2006209-05RwfFk"><div class="bx-row bx-row-text bx-row-text-sosumi  bx-row-QpOq2Vq bx-element-2006209-QpOq2Vq" id="bx-element-2006209-QpOq2Vq"><div>By subscribing you agree to our</div></div><div class="bx-row bx-row-text bx-row-text-sosumi  bx-row-1RQTpGT bx-element-2006209-1RQTpGT" id="bx-element-2006209-1RQTpGT"><a href="https://www.cnn.com/privacy0?no-st=9999999999" target="_blank" class="" data-click="hyperlink" data-click-report="nothing"><div>privacy policy.</div></a></div></div></form></div><div class="bx-step bx-step-2  bx-step-0rzJiqV bx-step-2006209-2 bx-tail-placement-hidden" id="bx-step-2006209-2" data-close-placement="inside"><form id="bx-form-2006209-step-2" bx-novalidate="true" method="post" action="https://api.bounceexchange.com/capture/submit" onsubmit="return bouncex.submitCampaignStep(2006209); return false" onreset="bouncex.close_ad(2006209); return false" tabindex="0" aria-labelledby="bx-campaign-ally-title-2006209"><input type="hidden" name="campaign_id" value="2006209"><div class="bx-group bx-group-default bx-group-2006209-W0NXBgQ bx-group-W0NXBgQ" id="bx-group-2006209-W0NXBgQ"><input type="hidden" name="acquisition_country" value="" class="bx-el bx-input bx-input-hidden"><input type="hidden" name="timestamp" value="" class="bx-el bx-input bx-input-hidden"><div class="bx-row bx-row-image bx-row-image-default  bx-row-HlnFDO2 bx-element-2006209-HlnFDO2" id="bx-element-2006209-HlnFDO2"><img src="//assets.bounceexchange.com/assets/uploads/clients/340/creatives/95e926ddff4057b5953d3091ed881688.png" alt="CNN Business Before the Bell"></div></div><div class="bx-group bx-group-primary bx-group-2006209-cENek6Z bx-group-cENek6Z" id="bx-group-2006209-cENek6Z"><div class="bx-row bx-row-image bx-row-image-default  bx-row-zPDhUQ7 bx-element-2006209-zPDhUQ7" id="bx-element-2006209-zPDhUQ7"><img src="//assets.bounceexchange.com/assets/uploads/clients/340/creatives/08b4405a08b7c5d4f38362368edcc721.png" alt="before markets open start your day smart"></div><div class="bx-row bx-row-text bx-row-text-subheadline  bx-row-rJLii60 bx-element-2006209-rJLii60" id="bx-element-2006209-rJLii60"><div>Get essential news and analysis on global markets with CNN Business’ daily newsletter. </div></div></div><div class="bx-group bx-group-default bx-group-2006209-jsE2CTH bx-group-jsE2CTH" id="bx-group-2006209-jsE2CTH"><div class="bx-row bx-row-input bx-row-input-default  bx-row-4q57Y6D bx-element-2006209-4q57Y6D" id="bx-element-2006209-4q57Y6D"><div class="bx-inputwrap"><input class="bx-el bx-input" id="bx-element-2006209-4q57Y6D-input" type="email" name="email" placeholder="Email address" aria-required="true"></div><div class="bx-component  bx-component-validation bx-vtext bx-error-2006209-email" id="bx-error-2006209-email">Please enter above</div></div><div class="bx-row bx-row-submit bx-row-submit-default  bx-row-ZaOTk2w bx-element-2006209-ZaOTk2w" id="bx-element-2006209-ZaOTk2w"><button type="submit" class="bx-button" data-click="submit" data-step-delay="0" data-submit-jump="0" data-submit-force="0">Sign me up</button></div><div class="bx-row bx-row-submit bx-row-submit-no  bx-row-Xt9YQwb bx-element-2006209-Xt9YQwb" id="bx-element-2006209-Xt9YQwb"><button type="reset" class="bx-button" data-click="close">No, thanks</button></div><div class="bx-row bx-row-text bx-row-text-sosumi  bx-row-wJoRFQs bx-element-2006209-wJoRFQs" id="bx-element-2006209-wJoRFQs"><div>By subscribing you agree to our</div></div><div class="bx-row bx-row-text bx-row-text-sosumi  bx-row-8jiaca8 bx-element-2006209-8jiaca8" id="bx-element-2006209-8jiaca8"><a href="https://www.cnn.com/privacy0?no-st=9999999999" target="_blank" class="" data-click="hyperlink" data-click-report="nothing"><div>privacy policy.</div></a></div></div><div class="bx-group bx-group-default bx-group-2006209-jcL9ay7 bx-group-jcL9ay7" id="bx-group-2006209-jcL9ay7"><div class="bx-row bx-row-text bx-row-text-sosumi  bx-row-JvwiiKC bx-element-2006209-JvwiiKC" id="bx-element-2006209-JvwiiKC"><div>By subscribing you agree to our</div></div><div class="bx-row bx-row-text bx-row-text-sosumi  bx-row-udRQ4vA bx-element-2006209-udRQ4vA" id="bx-element-2006209-udRQ4vA"><a href="https://www.cnn.com/privacy0?no-st=9999999999" target="_blank" class="" data-click="hyperlink" data-click-report="nothing"><div>privacy policy.</div></a></div></div><input autocomplete="on" type="input" name="carb-trap" tabindex="-1" aria-hidden="true" class="bx-input bx-carb-trap"></form></div><div class="bx-step bx-step-3  bx-step-YOJXpx1 bx-step-2006209-3 bx-tail-placement-hidden" id="bx-step-2006209-3" data-close-placement="inside"><form id="bx-form-2006209-step-3" bx-novalidate="true" method="post" action="https://api.bounceexchange.com/capture/submit" onsubmit="return bouncex.submitCampaignStep(2006209); return false" onreset="bouncex.close_ad(2006209); return false" tabindex="0" aria-labelledby="bx-campaign-ally-title-2006209"><input type="hidden" name="campaign_id" value="2006209"><div class="bx-group bx-group-default bx-group-2006209-Ztv3u95 bx-group-Ztv3u95" id="bx-group-2006209-Ztv3u95"><div class="bx-row bx-row-image bx-row-image-logo  bx-row-3RSkSX0 bx-element-2006209-3RSkSX0" id="bx-element-2006209-3RSkSX0"><img src="//assets.bounceexchange.com/assets/uploads/clients/340/creatives/c0471808583709142fad19339cb10c54.svg" alt=""></div></div><div class="bx-group bx-group-default bx-group-2006209-n7LpEFm bx-group-n7LpEFm" id="bx-group-2006209-n7LpEFm"><div class="bx-row bx-row-text bx-row-text-default  bx-row-7WfttCz bx-element-2006209-7WfttCz" id="bx-element-2006209-7WfttCz"><div>Success! Thanks for Subscribing </div></div><div class="bx-row bx-row-text bx-row-text-headline  bx-row-utFdNHQ bx-element-2006209-utFdNHQ" id="bx-element-2006209-utFdNHQ"><div><b>Get a behind-the-scenes look at CNN</b></div></div><div class="bx-row bx-row-text bx-row-text-headline  bx-row-wUGuHFk bx-element-2006209-wUGuHFk" id="bx-element-2006209-wUGuHFk"><div>Create your free CNN account to access. </div></div><div class="bx-row bx-row-submit bx-row-submit-default  bx-row-yLYWobj bx-element-2006209-yLYWobj" id="bx-element-2006209-yLYWobj"><a href="https://www.cnn.com/account/register?source=wk_bouncex_articleinline_btb_multi_reg_v1&amp;utm_source=wk_bouncex_articleinline_btb_multi_reg_v1&amp;redirect=https://www.cnn.com/account/settings?utm_source=wk_bouncex_articleinline_btb_multi_reg_v1_success" target="" class="bx-button" data-click="hyperlink" data-click-report="click">Get Access </a></div></div></form></div></div></div></div></div><a id="bx-close-outside-2006209" class="bx-close bx-close-link bx-close-outside" data-click="close" href="javascript:void(0)"><svg class="bx-close-xsvg" viewBox="240 240 20 20" aria-hidden="true"><g class="bx-close-xstroke bx-close-x-adaptive"><path class="bx-close-x-adaptive-1" d="M255.6 255.6l-11.2-11.2" vector-effect="non-scaling-stroke"></path><path class="bx-close-x-adaptive-2" d="M255.6 244.4l-11.2 11.2" vector-effect="non-scaling-stroke"></path></g></svg><div class="bx-ally-label">close dialog</div></a><style id="bx-campaign-2006209-style">/* effects for .bx-campaign-2006209 *//* custom css .bx-campaign-2006209 *//* custom css from creative 49149 */@-ms-keyframes bx-anim-2006209-spin {         from {             -ms-transform: rotate(0deg);         } to {             -ms-transform: rotate(360deg);         }    }  @-moz-keyframes bx-anim-2006209-spin {       from {           -moz-transform: rotate(0deg);       } to {           -moz-transform: rotate(360deg);       }  }  @-webkit-keyframes bx-anim-2006209-spin {       from {           -webkit-transform: rotate(0deg);       } to {           -webkit-transform: rotate(360deg);       }  }  @keyframes bx-anim-2006209-spin {       from {           transform: rotate(0deg);       } to {           transform: rotate(360deg);       }  }      .bx-custom.bx-campaign-2006209 .bx-row-validation .bx-input {      border-width: 1px !important;  }   /* custom css from creative 53617 *//*Custom code for animation and text display*/.bx-custom.bx-campaign-2006209 .bx-row-input.bx-row-validation .bx-vtext {    font-size: 11px;    color: #ee2924;}@keyframes bx-anim-2006209-spin {     100% { transform: rotate(360deg); }}/* rendered styles .bx-campaign-2006209 */.bxc.bx-campaign-2006209.bx-active-step-1 .bx-creative:before {min-height: 185px;}.bxc.bx-campaign-2006209.bx-active-step-1 .bx-creative {background-size: 100%;max-width: 900px;border-style: solid;border-color: rgb(213, 213, 213);border-width: 1px 0;}@media all and (max-width: 736px) {.bxc.bx-campaign-2006209.bx-active-step-1 .bx-creative {height: auto;}}.bxc.bx-campaign-2006209.bx-active-step-1 .bx-creative> *:first-child {width: 100%;padding: 12px;}@media all and (max-width: 736px) {.bxc.bx-campaign-2006209.bx-active-step-1 .bx-creative> *:first-child {width: 100%;padding: 13px 0;vertical-align: top;}}.bxc.bx-campaign-2006209.bx-active-step-1 .bx-close {width: 20px;stroke-width: 1.3px;}@media all and (max-width: 736px) {.bxc.bx-campaign-2006209.bx-active-step-1 .bx-close {width: 33px;height: 33px;padding: 0 0 12px 12px;}}.bxc.bx-campaign-2006209 .bx-group-2006209-478Av0E {width: 25%;}@media all and (max-width: 736px) {.bxc.bx-campaign-2006209 .bx-group-2006209-478Av0E {width: 180px;}}@media all and (min-width: 737px) and (max-width: 1024px) {.bxc.bx-campaign-2006209 .bx-group-2006209-478Av0E {text-align: right;}}@media all and (min-width: 1025px) {.bxc.bx-campaign-2006209 .bx-group-2006209-478Av0E {text-align: right;}}@media all and (min-width: 737px) and (max-width: 1024px) {.bxc.bx-campaign-2006209 .bx-element-2006209-GnNg8zY {width: 90%;text-align: right;}}@media all and (min-width: 1025px) {.bxc.bx-campaign-2006209 .bx-element-2006209-GnNg8zY {width: 83.33333333333334%;}}.bxc.bx-campaign-2006209 .bx-group-2006209-ZWUw1PY {padding: 0 0 0 20px;width: 60%;}@media all and (max-width: 736px) {.bxc.bx-campaign-2006209 .bx-group-2006209-ZWUw1PY {text-align: center;width: 100%;padding: 5px 0 10px 0;}}@media all and (min-width: 737px) and (max-width: 1024px) {.bxc.bx-campaign-2006209 .bx-group-2006209-ZWUw1PY {text-align: left;min-width: 440px;width: 75%;}}@media all and (min-width: 1025px) {.bxc.bx-campaign-2006209 .bx-group-2006209-ZWUw1PY {text-align: left;min-width: 500px;}}.bxc.bx-campaign-2006209 .bx-element-2006209-7iyD9gg {width: 75%;}@media all and (max-width: 736px) {.bxc.bx-campaign-2006209 .bx-element-2006209-7iyD9gg {width: 350px;}}@media all and (min-width: 1025px) {.bxc.bx-campaign-2006209 .bx-element-2006209-7iyD9gg {width: 90%;}}.bxc.bx-campaign-2006209 .bx-element-2006209-DSUWecj> *:first-child {font-size: 15px;padding: 8px 0 0;line-height: 1.33;font-weight: 500;font-family: CNN,Helvetica Neue,Helvetica,Arial,Utkal,sans-serif;}@media all and (max-width: 736px) {.bxc.bx-campaign-2006209 .bx-element-2006209-DSUWecj> *:first-child {font-size: 13.5px;padding: 5px 0 0;}}@media all and (min-width: 737px) and (max-width: 1024px) {.bxc.bx-campaign-2006209 .bx-element-2006209-DSUWecj> *:first-child {padding: 6px 0 0 ;}}@media all and (min-width: 1025px) {.bxc.bx-campaign-2006209 .bx-element-2006209-DSUWecj> *:first-child {padding: 6px 0 0;}}.bxc.bx-campaign-2006209 .bx-element-2006209-DSUWecj {width: 100%;}@media all and (max-width: 736px) {.bxc.bx-campaign-2006209 .bx-element-2006209-DSUWecj {text-align: center;}}@media all and (min-width: 737px) and (max-width: 1024px) {.bxc.bx-campaign-2006209 .bx-element-2006209-DSUWecj {width: 600px;}}.bxc.bx-campaign-2006209 .bx-group-2006209-wUDoY4p {width: 50%;padding: 12px 0 0;}@media all and (max-width: 736px) {.bxc.bx-campaign-2006209 .bx-group-2006209-wUDoY4p {width: 300px;padding: 0;min-width: 310px;}}@media all and (min-width: 737px) and (max-width: 1024px) {.bxc.bx-campaign-2006209 .bx-group-2006209-wUDoY4p {min-width: 700px;width: 90%;}}@media all and (min-width: 1025px) {.bxc.bx-campaign-2006209 .bx-group-2006209-wUDoY4p {width: 60%;min-width: 700px;}}.bxc.bx-campaign-2006209 .bx-element-2006209-GXSXxmX {width: 100%;padding: 0 0 0 10px;}@media all and (max-width: 736px) {.bxc.bx-campaign-2006209 .bx-element-2006209-GXSXxmX {padding: 0 0 5px 0;width: 310px;}}@media all and (min-width: 737px) and (max-width: 1024px) {.bxc.bx-campaign-2006209 .bx-element-2006209-GXSXxmX {width: 50%;padding: 0 6px 8px 0;}}@media all and (min-width: 1025px) {.bxc.bx-campaign-2006209 .bx-element-2006209-GXSXxmX {width: 50%;padding: 0 5px 12px 0;}}.bxc.bx-campaign-2006209 .bx-element-2006209-GXSXxmX> *:first-child {padding: 13px;font-family: CNN,Helvetica Neue,Helvetica,Arial,Utkal,sans-serif;font-weight: 300;text-transform: capitalize;border-style: solid;border-color: #26c4a8;border-width: 1px;border-radius: 0;background-color: #26c4a8;line-height: 1em;}.bxc.bx-campaign-2006209 .bx-element-2006209-GXSXxmX> *:first-child:hover {border-color: #26c4a8;background-color: #26c4a8;}@media all and (max-width: 736px) {.bxc.bx-campaign-2006209 .bx-element-2006209-GXSXxmX> *:first-child {font-size: 14px;padding: 12px;}}.bxc.bx-campaign-2006209 .bx-element-2006209-EvIbRnF {width: 100%;padding: 0 10px 0 0;}@media all and (max-width: 736px) {.bxc.bx-campaign-2006209 .bx-element-2006209-EvIbRnF {display: inline-block;padding: 0;width: 310px;}}@media all and (min-width: 737px) and (max-width: 1024px) {.bxc.bx-campaign-2006209 .bx-element-2006209-EvIbRnF {padding: 0 0 8px 6px;width: 50%;}}@media all and (min-width: 1025px) {.bxc.bx-campaign-2006209 .bx-element-2006209-EvIbRnF {width: 50%;padding: 0 0 12px 5px;}}.bxc.bx-campaign-2006209 .bx-element-2006209-EvIbRnF> *:first-child {padding: 13px;font-family: CNN,Helvetica Neue,Helvetica,Arial,Utkal,sans-serif;font-weight: 400;text-transform: capitalize;text-decoration: none;border-style: solid;border-color: black;border-width: 1px;border-radius: 0;color: black;line-height: 1em;}.bxc.bx-campaign-2006209 .bx-element-2006209-EvIbRnF> *:first-child:hover {color: black;border-style: solid;border-color: rgb(0, 0, 0);border-width: 1px;background-color: white;}@media all and (max-width: 736px) {.bxc.bx-campaign-2006209 .bx-element-2006209-EvIbRnF> *:first-child {font-size: 14px;border-color: black;border-radius: 0;padding: 12px;}}.bxc.bx-campaign-2006209 .bx-element-2006209-fOVTXdl {width: auto;}.bxc.bx-campaign-2006209 .bx-element-2006209-fOVTXdl> *:first-child {padding: 0 4px 0 0;font-size: 10px;font-weight: 500;font-family: CNN,Helvetica Neue,Helvetica,Arial,Utkal,sans-serif;color: black;}@media all and (max-width: 736px) {.bxc.bx-campaign-2006209 .bx-element-2006209-fOVTXdl> *:first-child {font-size: 11px;padding: 10px 4px 0;}}.bxc.bx-campaign-2006209 .bx-element-2006209-rXnlSnx {width: auto;}.bxc.bx-campaign-2006209 .bx-element-2006209-rXnlSnx> *:first-child {padding: 0;font-size: 10px;font-weight: 500;font-family: CNN,Helvetica Neue,Helvetica,Arial,Utkal,sans-serif;color: #26c4a8;}@media all and (max-width: 736px) {.bxc.bx-campaign-2006209 .bx-element-2006209-rXnlSnx> *:first-child {font-size: 11px;padding: 10px 0 0;}}.bxc.bx-campaign-2006209 .bx-group-2006209-05RwfFk {display: none;}@media all and (min-width: 737px) and (max-width: 1024px) {.bxc.bx-campaign-2006209 .bx-group-2006209-05RwfFk {min-width: 700px;}}@media all and (min-width: 1025px) {.bxc.bx-campaign-2006209 .bx-group-2006209-05RwfFk {min-width: 700px;}}.bxc.bx-campaign-2006209 .bx-element-2006209-QpOq2Vq {width: auto;}.bxc.bx-campaign-2006209 .bx-element-2006209-QpOq2Vq> *:first-child {padding: 0 4px 0 0;font-size: 14px;font-weight: 300;font-family: CNN,Helvetica Neue,Helvetica,Arial,Utkal,sans-serif;color: black;}@media all and (max-width: 736px) {.bxc.bx-campaign-2006209 .bx-element-2006209-QpOq2Vq> *:first-child {font-size: 12px;}}.bxc.bx-campaign-2006209 .bx-element-2006209-1RQTpGT {width: auto;}.bxc.bx-campaign-2006209 .bx-element-2006209-1RQTpGT> *:first-child {padding: 0;font-size: 14px;font-weight: 300;font-family: CNN,Helvetica Neue,Helvetica,Arial,Utkal,sans-serif;color: #26c4a8;}@media all and (max-width: 736px) {.bxc.bx-campaign-2006209 .bx-element-2006209-1RQTpGT> *:first-child {font-size: 12px;}}.bxc.bx-campaign-2006209.bx-active-step-2 .bx-creative:before {min-height: 185px;}.bxc.bx-campaign-2006209.bx-active-step-2 .bx-creative {background-size: 100%;max-width: 900px;border-style: solid;border-color: rgb(213, 213, 213);border-width: 1px 0;}@media all and (max-width: 736px) {.bxc.bx-campaign-2006209.bx-active-step-2 .bx-creative {height: auto;}}.bxc.bx-campaign-2006209.bx-active-step-2 .bx-creative> *:first-child {width: 100%;padding: 12px;}@media all and (max-width: 736px) {.bxc.bx-campaign-2006209.bx-active-step-2 .bx-creative> *:first-child {width: 100%;padding: 10px 0;vertical-align: top;}}@media all and (min-width: 1025px) {.bxc.bx-campaign-2006209.bx-active-step-2 .bx-creative> *:first-child {padding: 15px;}}.bxc.bx-campaign-2006209.bx-active-step-2 .bx-close {width: 20px;stroke-width: 1.3px;}@media all and (max-width: 736px) {.bxc.bx-campaign-2006209.bx-active-step-2 .bx-close {width: 33px;height: 33px;padding: 0 0 12px 12px;}}.bxc.bx-campaign-2006209 .bx-group-2006209-W0NXBgQ {width: 25%;}@media all and (max-width: 736px) {.bxc.bx-campaign-2006209 .bx-group-2006209-W0NXBgQ {width: 180px;}}@media all and (min-width: 737px) and (max-width: 1024px) {.bxc.bx-campaign-2006209 .bx-group-2006209-W0NXBgQ {text-align: right;}}@media all and (min-width: 1025px) {.bxc.bx-campaign-2006209 .bx-group-2006209-W0NXBgQ {text-align: right;}}@media all and (max-width: 736px) {.bxc.bx-campaign-2006209 .bx-element-2006209-HlnFDO2 {width: 160px;}}@media all and (min-width: 737px) and (max-width: 1024px) {.bxc.bx-campaign-2006209 .bx-element-2006209-HlnFDO2 {width: 90%;text-align: right;}}@media all and (min-width: 1025px) {.bxc.bx-campaign-2006209 .bx-element-2006209-HlnFDO2 {width: 83.33333333333334%;}}.bxc.bx-campaign-2006209 .bx-group-2006209-cENek6Z {padding: 0 0 0 20px;width: 60%;}@media all and (max-width: 736px) {.bxc.bx-campaign-2006209 .bx-group-2006209-cENek6Z {text-align: center;width: 100%;padding: 5px 0 0;}}@media all and (min-width: 737px) and (max-width: 1024px) {.bxc.bx-campaign-2006209 .bx-group-2006209-cENek6Z {text-align: left;min-width: 440px;width: 75%;}}@media all and (min-width: 1025px) {.bxc.bx-campaign-2006209 .bx-group-2006209-cENek6Z {text-align: left;min-width: 500px;}}.bxc.bx-campaign-2006209 .bx-element-2006209-zPDhUQ7 {width: 75%;}@media all and (max-width: 736px) {.bxc.bx-campaign-2006209 .bx-element-2006209-zPDhUQ7 {width: 350px;}}@media all and (min-width: 1025px) {.bxc.bx-campaign-2006209 .bx-element-2006209-zPDhUQ7 {width: 90%;}}.bxc.bx-campaign-2006209 .bx-element-2006209-rJLii60> *:first-child {font-size: 15px;padding: 8px 0 0;line-height: 1.33;font-weight: 500;font-family: CNN,Helvetica Neue,Helvetica,Arial,Utkal,sans-serif;}@media all and (max-width: 736px) {.bxc.bx-campaign-2006209 .bx-element-2006209-rJLii60> *:first-child {font-size: 13.5px;padding: 5px 0 0;}}@media all and (min-width: 737px) and (max-width: 1024px) {.bxc.bx-campaign-2006209 .bx-element-2006209-rJLii60> *:first-child {padding: 6px 0 0 ;}}@media all and (min-width: 1025px) {.bxc.bx-campaign-2006209 .bx-element-2006209-rJLii60> *:first-child {padding: 6px 0 0;}}.bxc.bx-campaign-2006209 .bx-element-2006209-rJLii60 {width: 100%;}@media all and (max-width: 736px) {.bxc.bx-campaign-2006209 .bx-element-2006209-rJLii60 {text-align: center;}}@media all and (min-width: 737px) and (max-width: 1024px) {.bxc.bx-campaign-2006209 .bx-element-2006209-rJLii60 {width: 600px;}}.bxc.bx-campaign-2006209 .bx-group-2006209-jsE2CTH {width: 50%;padding: 10px 0 0;}@media all and (max-width: 736px) {.bxc.bx-campaign-2006209 .bx-group-2006209-jsE2CTH {width: 300px;padding: 10px 0 0;min-width: 310px;}}@media all and (min-width: 737px) and (max-width: 1024px) {.bxc.bx-campaign-2006209 .bx-group-2006209-jsE2CTH {width: 90%;min-width: 700px;}}@media all and (min-width: 1025px) {.bxc.bx-campaign-2006209 .bx-group-2006209-jsE2CTH {width: 70%;min-width: 700px;}}.bxc.bx-campaign-2006209 .bx-element-2006209-4q57Y6D {padding: 0 0 5px;width: 100%;}@media all and (max-width: 736px) {.bxc.bx-campaign-2006209 .bx-element-2006209-4q57Y6D {width: 310px;padding: 0 0 5px;}}@media all and (min-width: 737px) and (max-width: 1024px) {.bxc.bx-campaign-2006209 .bx-element-2006209-4q57Y6D {width: 100%;}}.bxc.bx-campaign-2006209 .bx-element-2006209-4q57Y6D .bx-el {padding: 10.5px;border-color: rgb(245, 245, 245);border-width: 1px;background-color: rgb(245, 245, 245);}.bxc.bx-campaign-2006209 .bx-has-text.bx-element-2006209-4q57Y6D .bx-el {padding: 10.5px;}.bxc.bx-campaign-2006209 .bx-element-2006209-4q57Y6D .bx-el:hover {border-color: rgb(245, 245, 245);border-width: 1px;}.bxc.bx-campaign-2006209 .bx-element-2006209-4q57Y6D .bx-el:focus {border-color: black;border-width: 1px;}@media all and (max-width: 736px) {.bxc.bx-campaign-2006209 .bx-element-2006209-4q57Y6D .bx-el {font-size: 14px;padding: 10px;}.bxc.bx-campaign-2006209 .bx-has-text.bx-element-2006209-4q57Y6D .bx-el {padding: 10px;}}.bxc.bx-campaign-2006209 .bx-element-2006209-ZaOTk2w {width: 100%;padding: 0 0 0 10px;}@media all and (max-width: 736px) {.bxc.bx-campaign-2006209 .bx-element-2006209-ZaOTk2w {padding: 0 0 5px 0;width: 310px;}}@media all and (min-width: 737px) and (max-width: 1024px) {.bxc.bx-campaign-2006209 .bx-element-2006209-ZaOTk2w {width: 50%;padding: 0 6px 15px 0;}}@media all and (min-width: 1025px) {.bxc.bx-campaign-2006209 .bx-element-2006209-ZaOTk2w {width: 50%;padding: 0 5px 12px 0;}}.bxc.bx-campaign-2006209 .bx-element-2006209-ZaOTk2w> *:first-child {padding: 13px;font-weight: 400;text-transform: capitalize;border-style: solid;border-color: #26c4a8;border-width: 1px;border-radius: 0;background-color: #26c4a8;line-height: 1em;}.bxc.bx-campaign-2006209 .bx-element-2006209-ZaOTk2w> *:first-child:hover {border-color: #26c4a8;background-color: #26c4a8;}@media all and (max-width: 736px) {.bxc.bx-campaign-2006209 .bx-element-2006209-ZaOTk2w> *:first-child {font-size: 14px;padding: 12px;}}.bxc.bx-campaign-2006209 .bx-element-2006209-Xt9YQwb {width: 100%;padding: 0 10px 0 0;}@media all and (max-width: 736px) {.bxc.bx-campaign-2006209 .bx-element-2006209-Xt9YQwb {display: inline-block;padding: 0;width: 310px;}}@media all and (min-width: 737px) and (max-width: 1024px) {.bxc.bx-campaign-2006209 .bx-element-2006209-Xt9YQwb {padding: 0 0 15px 6px;width: 50%;}}@media all and (min-width: 1025px) {.bxc.bx-campaign-2006209 .bx-element-2006209-Xt9YQwb {width: 50%;padding: 0 0 12px 5px;}}.bxc.bx-campaign-2006209 .bx-element-2006209-Xt9YQwb> *:first-child {padding: 13px;font-weight: 400;text-transform: capitalize;text-decoration: none;border-style: solid;border-color: black;border-width: 1px;border-radius: 0;line-height: 1em;}.bxc.bx-campaign-2006209 .bx-element-2006209-Xt9YQwb> *:first-child:hover {color: black;border-style: solid;border-color: black;border-width: 1px;background-color: white;}@media all and (max-width: 736px) {.bxc.bx-campaign-2006209 .bx-element-2006209-Xt9YQwb> *:first-child {font-size: 14px;border-color: black;border-radius: 0;padding: 10px;}}.bxc.bx-campaign-2006209 .bx-element-2006209-wJoRFQs {width: auto;}.bxc.bx-campaign-2006209 .bx-element-2006209-wJoRFQs> *:first-child {padding: 0 4px 0 0;font-size: 10px;font-weight: 500;font-family: CNN,Helvetica Neue,Helvetica,Arial,Utkal,sans-serif;color: black;}@media all and (max-width: 736px) {.bxc.bx-campaign-2006209 .bx-element-2006209-wJoRFQs> *:first-child {font-size: 11px;padding: 10px 4px 0;}}.bxc.bx-campaign-2006209 .bx-element-2006209-8jiaca8 {width: auto;}.bxc.bx-campaign-2006209 .bx-element-2006209-8jiaca8> *:first-child {padding: 0;font-size: 10px;font-weight: 500;font-family: CNN,Helvetica Neue,Helvetica,Arial,Utkal,sans-serif;color: #26c4a8;}@media all and (max-width: 736px) {.bxc.bx-campaign-2006209 .bx-element-2006209-8jiaca8> *:first-child {font-size: 11px;padding: 10px 0 0;}}.bxc.bx-campaign-2006209 .bx-group-2006209-jcL9ay7 {display: none;}@media all and (min-width: 737px) and (max-width: 1024px) {.bxc.bx-campaign-2006209 .bx-group-2006209-jcL9ay7 {min-width: 700px;}}@media all and (min-width: 1025px) {.bxc.bx-campaign-2006209 .bx-group-2006209-jcL9ay7 {min-width: 700px;}}.bxc.bx-campaign-2006209 .bx-element-2006209-JvwiiKC {width: auto;}.bxc.bx-campaign-2006209 .bx-element-2006209-JvwiiKC> *:first-child {padding: 0 4px 0 0;font-size: 14px;font-weight: 300;font-family: CNN,Helvetica Neue,Helvetica,Arial,Utkal,sans-serif;color: black;}@media all and (max-width: 736px) {.bxc.bx-campaign-2006209 .bx-element-2006209-JvwiiKC> *:first-child {font-size: 12px;}}.bxc.bx-campaign-2006209 .bx-element-2006209-udRQ4vA {width: auto;}.bxc.bx-campaign-2006209 .bx-element-2006209-udRQ4vA> *:first-child {padding: 0;font-size: 14px;font-weight: 300;font-family: CNN,Helvetica Neue,Helvetica,Arial,Utkal,sans-serif;color: #c90713;}@media all and (max-width: 736px) {.bxc.bx-campaign-2006209 .bx-element-2006209-udRQ4vA> *:first-child {font-size: 12px;}}.bxc.bx-campaign-2006209.bx-active-step-3 .bx-creative:before {min-height: 185px;}.bxc.bx-campaign-2006209.bx-active-step-3 .bx-creative {border-color: #c1c1c1;border-style: solid;background-size: contain;background-color: white;border-width: 1px 0;border-radius: 0;}.bxc.bx-campaign-2006209.bx-active-step-3 .bx-creative> *:first-child {width: 780px;padding: 10px;vertical-align: middle;}@media all and (max-width: 736px) {.bxc.bx-campaign-2006209.bx-active-step-3 .bx-creative> *:first-child {width: 340px;padding: 12px;}}.bxc.bx-campaign-2006209.bx-active-step-3 .bx-close {stroke: rgb(193, 193, 193);stroke-width: 2px;width: 24px;height: 24px;}@media all and (max-width: 736px) {.bxc.bx-campaign-2006209.bx-active-step-3 .bx-close {width: 30px;height: 30px;padding: 0 0 10px 10px;}}.bxc.bx-campaign-2006209 .bx-group-2006209-Ztv3u95 {width: 135px;text-align: center;padding: 0 0 55px;}@media all and (max-width: 736px) {.bxc.bx-campaign-2006209 .bx-group-2006209-Ztv3u95 {text-align: center;width: 300px;padding: 0  0 15px;}}.bxc.bx-campaign-2006209 .bx-element-2006209-3RSkSX0 {padding: 0;width: auto;}.bxc.bx-campaign-2006209 .bx-element-2006209-3RSkSX0> *:first-child {background-color: transparent;background-size: contain;padding: 0;height: 60px !important;}@media all and (max-width: 736px) {.bxc.bx-campaign-2006209 .bx-element-2006209-3RSkSX0> *:first-child {height: 40px !important;}}.bxc.bx-campaign-2006209 .bx-group-2006209-n7LpEFm {width: 505px;padding: 2px 0 0 30px;text-align: left;}@media all and (max-width: 736px) {.bxc.bx-campaign-2006209 .bx-group-2006209-n7LpEFm {width: 300px;padding: 0;text-align: center;}}.bxc.bx-campaign-2006209 .bx-element-2006209-7WfttCz> *:first-child {font-weight: 700;font-size: 14px;letter-spacing: .05em;text-transform: uppercase;}@media all and (max-width: 736px) {.bxc.bx-campaign-2006209 .bx-element-2006209-7WfttCz> *:first-child {font-size: 12.5px;}}.bxc.bx-campaign-2006209 .bx-element-2006209-utFdNHQ {width: 100%;padding: 8px 0;}@media all and (max-width: 736px) {.bxc.bx-campaign-2006209 .bx-element-2006209-utFdNHQ {width: 80%;}}.bxc.bx-campaign-2006209 .bx-element-2006209-utFdNHQ> *:first-child {font-family: CNN,Helvetica Neue,Helvetica,Arial,Utkal,sans-serif;font-weight: 500;font-size: 24px;color: #282828;line-height: 1em;}@media all and (max-width: 736px) {.bxc.bx-campaign-2006209 .bx-element-2006209-utFdNHQ> *:first-child {font-size: 24px;min-width: auto;padding: 0;line-height: 1.2;}}.bxc.bx-campaign-2006209 .bx-element-2006209-wUGuHFk {width: 100%;}@media all and (max-width: 736px) {.bxc.bx-campaign-2006209 .bx-element-2006209-wUGuHFk {width: 100%;}}@media all and (min-width: 1025px) {.bxc.bx-campaign-2006209 .bx-element-2006209-wUGuHFk {width: 500px;}}.bxc.bx-campaign-2006209 .bx-element-2006209-wUGuHFk> *:first-child {font-family: CNN,Helvetica Neue,Helvetica,Arial,Utkal,sans-serif;font-weight: 400;font-size: 18px;color: #282828;line-height: 1em;padding: 5px 0 0 0 ;}@media all and (max-width: 736px) {.bxc.bx-campaign-2006209 .bx-element-2006209-wUGuHFk> *:first-child {font-size: 14.5px;}}.bxc.bx-campaign-2006209 .bx-element-2006209-yLYWobj {width: 200px;padding: 20px 0 0 0;}@media all and (max-width: 736px) {.bxc.bx-campaign-2006209 .bx-element-2006209-yLYWobj {padding: 20px 0 5px;}}.bxc.bx-campaign-2006209 .bx-element-2006209-yLYWobj> *:first-child {padding: 11px;}</style></div><p class="paragraph inline-placeholder" data-uri="cms.cnn.com/_components/paragraph/instances/paragraph_B80DE937-D34B-14B1-552D-177E2C4DE6A8@published" data-editable="text" data-component-name="paragraph" data-analytics-observe="on">
    Reports that Country Garden had missing interest payments on two US dollar bonds <a href="https://www.cnn.com/2023/08/09/economy/country-garden-china-property-default-intl-hnk/index.html" target="_blank">spooked investors</a> and rekindled memories of Evergrande, whose debt defaults in 2021 signaled the start of the real estate crisis. 
</p>

<p class="paragraph inline-placeholder" data-uri="cms.cnn.com/_components/paragraph/instances/paragraph_DBAFA9FD-C80D-0204-DB8E-1670CE790630@published" data-editable="text" data-component-name="paragraph" data-analytics-observe="on">
    While <a href="https://www.cnn.com/2023/08/17/business/evergrande-files-for-bankruptcy/index.html" target="_blank">Evergrande</a> is still undergoing a debt restructuring, troubles at Country Garden raised fresh concerns about the Chinese economy. 
</p>

<p class="paragraph inline-placeholder" data-uri="cms.cnn.com/_components/paragraph/instances/paragraph_49320FE7-C313-3B88-39CF-171631C33A31@published" data-editable="text" data-component-name="paragraph" data-analytics-observe="on">
    Beijing has rolled out a raft of supportive measures to revive the real estate market. But even the stronger players are now teetering on the brink of default, underscoring the challenges Beijing faces to contain the crisis.
</p>

<div data-uri="cms.cnn.com/_components/related-content/instances/related-content-h_3378b3af5a7add8ef063c98bfc2798c2-h_ba74c952f5f3ac3a094a726d0c92d828@published" class="related-content related-content--article" data-analytics-observe="on">
    <a class="related-content__link" href="/2023/08/17/business/evergrande-files-for-bankruptcy/index.html">
          <div class="related-content__image image__related-content">
      <div data-uri="cms.cnn.com/_components/image/instances/thumbnail-related-4005f809b7a38b868d6669f953dcf8e8@published" class="image image__hide-placeholder image--eq-extra-small" data-image-variation="image" data-name="China Evergrande Group FILE 081723" data-component-name="image" data-observe-resizes="" data-breakpoints="{&quot;image--eq-extra-small&quot;: 115, &quot;image--eq-small&quot;: 300}" data-original-ratio="0.5943333333333334" data-original-height="1783" data-original-width="3000" data-url="https://media.cnn.com/api/v1/images/stellar/prod/230817171723-china-evergrande-group-file-081723.jpg?c=original" data-editable="settings">
    
  <div class="image__container " data-image-variation="image" data-breakpoints="{&quot;image--eq-extra-small&quot;: 115, &quot;image--eq-small&quot;: 300, &quot;image--show-credits&quot;: 596}">
     <picture class="image__picture"><img src="https://media.cnn.com/api/v1/images/stellar/prod/230817171723-china-evergrande-group-file-081723.jpg?c=16x9&amp;q=h_144,w_256,c_fill" alt="A picture taken on Sep. 29, 2021 shows the headquarters building of Chinese developer Evergrande Group in Shenzhen, Guangdong Province, China. The group is in financial crisis. ( The Yomiuri Shimbun via AP Images )" class="image__dam-img" onload="this.classList.remove('image__dam-img--loading')" onerror="imageLoadError(this)" height="1783" width="3000" loading="lazy"></picture>
  </div>
  
    <div class="image__metadata">
      <div itemprop="caption" class="image__caption attribution">

<span data-editable="metaCaption" class="inline-placeholder">A picture taken on Sep. 29, 2021 shows the headquarters building of Chinese developer Evergrande Group in Shenzhen, Guangdong Province, China. The group is in financial crisis. ( The Yomiuri Shimbun via AP Images )</span>

</div>
      <figcaption class="image__credit">Koki Kataoka/The Yomiuri Shimbun/AP</figcaption>
    </div>
  
</div>

  </div>
  <p class="related-content__headline">
    
    <span class="related-content__headline-text" data-editable="content.headline">China's Evergrande files for bankruptcy</span>
  </p>
    </a>
</div>



<p class="paragraph inline-placeholder" data-uri="cms.cnn.com/_components/paragraph/instances/paragraph_EEAC5AA3-F3BA-CF51-41A8-169057381709@published" data-editable="text" data-component-name="paragraph" data-analytics-observe="on">
    In the meantime, debt defaults at property developers appear to have spread to the country’s $2.9 trillion investment trust industry.
</p>

<p class="paragraph inline-placeholder" data-uri="cms.cnn.com/_components/paragraph/instances/paragraph_3D0E7A8D-1B60-FB1D-528C-16924D0CC173@published" data-editable="text" data-component-name="paragraph" data-analytics-observe="on">
    Zhongrong Trust, which managed $87 billion worth of funds for corporate clients and wealthy individuals, has failed to repay a series of investment products to at least four companies, worth about $19 million, according to company statements from earlier this month. 
</p>

<p class="paragraph inline-placeholder" data-uri="cms.cnn.com/_components/paragraph/instances/paragraph_33897707-70DC-3A6C-F028-1694A3251799@published" data-editable="text" data-component-name="paragraph" data-analytics-observe="on">
    Angry demonstrators even protested recently outside of the office of the trust company, demanding payouts on high-yield products, according to videos posted on Chinese social media seen by CNN.
</p>

<p class="paragraph inline-placeholder" data-uri="cms.cnn.com/_components/paragraph/instances/paragraph_6C423D5C-48E7-BFF4-8362-16DCC16473B2@published" data-editable="text" data-component-name="paragraph" data-analytics-observe="on">
    “Further losses in the property sector risk spilling over into wider financial instability,” said Julian Evans-Pritchard, head of China economics at Capital Economics.
</p>

<p class="paragraph inline-placeholder" data-uri="cms.cnn.com/_components/paragraph/instances/paragraph_FFA3CEAD-57E0-6682-F374-16DE17567281@published" data-editable="text" data-component-name="paragraph" data-analytics-observe="on">
    “With domestic funds increasingly fleeing to the safety of government bonds and bank deposits, more non-bank financial institutions could face liquidity problems,” he added.
</p>

<h2 class="subheader" data-editable="text" data-uri="cms.cnn.com/_components/subheader/instances/paragraph_CBC787F8-7E50-9E95-68BC-1699B576C140@published" data-component-name="subheader" id="local-government-debt">
  Local government debt
</h2>

<p class="paragraph inline-placeholder" data-uri="cms.cnn.com/_components/paragraph/instances/paragraph_1B02584A-9C33-25DF-53AC-1692A2128586@published" data-editable="text" data-component-name="paragraph" data-analytics-observe="on">
    Another major concern is<a href="https://www.cnn.com/2023/01/31/economy/china-local-governments-basic-services-debt-crisis-intl-hnk/index.html" target="_blank"> local government debt</a>, which has soared largely due to a sharp drop in land sale revenues because of the property slump, as well as the lingering impact of the cost of imposing pandemic lockdowns.
</p>

<p class="paragraph inline-placeholder" data-uri="cms.cnn.com/_components/paragraph/instances/paragraph_115B1E08-534F-60C7-24F7-16C63AEF8F06@published" data-editable="text" data-component-name="paragraph" data-analytics-observe="on">
    The severe fiscal stress seen at local levels not only poses great risks to Chinese banks, but also squeezes the government’s ability to spur growth and expand public services.
</p>

<p class="paragraph inline-placeholder" data-uri="cms.cnn.com/_components/paragraph/instances/paragraph_71AE368C-DCA2-68F9-D664-16AFAC702451@published" data-editable="text" data-component-name="paragraph" data-analytics-observe="on">
    Beijing has so far unveiled a steady incremental drip of measures to boost the economy, including interest rate cuts and other moves to help the property market and consumer businesses. 
</p>

<p class="paragraph inline-placeholder" data-uri="cms.cnn.com/_components/paragraph/instances/paragraph_9DA2BD2A-DAF7-9EFC-0371-172089DBBE1E@published" data-editable="text" data-component-name="paragraph" data-analytics-observe="on">
    But it has <a href="https://www.cnn.com/2023/08/06/economy/china-economy-stimulus-limited-options-intl-hnk/index.html" target="_blank">refrained from making</a> any major moves. Economists and analysts have told CNN that is because China has become too indebted to pump up the economy like it did 15 years ago, during the global financial crisis.
</p>

<p class="paragraph inline-placeholder" data-uri="cms.cnn.com/_components/paragraph/instances/paragraph_89D814C9-D90B-794F-69BA-16AF936F9B5C@published" data-editable="text" data-component-name="paragraph" data-analytics-observe="on">
    Back then, Chinese leaders rolled out a four trillion yuan ($586 billion) fiscal package to minimize the impact of the global financial crisis. But the measures, which were focused on government-led infrastructure projects, also led to an unprecedented credit expansion and massive increase in local government debt, from which the economy is still struggling to recover. 
</p>

<p class="paragraph inline-placeholder" data-uri="cms.cnn.com/_components/paragraph/instances/paragraph_971A1A34-8D2E-01D7-9D76-16E1BE2AE1C4@published" data-editable="text" data-component-name="paragraph" data-analytics-observe="on">
    “While there is also a cyclical element to the current downturn that justifies greater stimulus, policymakers appear concerned that their traditional policy playbook would lead to a further rise in debt levels that would come back to the bite them in future,” said<strong> </strong>Evans-Pritchard.
</p>

<p class="paragraph inline-placeholder" data-uri="cms.cnn.com/_components/paragraph/instances/paragraph_8B5B5CA8-4CA5-AF6B-C072-16BA1A8E60FD@published" data-editable="text" data-component-name="paragraph" data-analytics-observe="on">
    On Sunday, Beijing policymakers reaffirmed that one of their top priorities was to contain systemic debt risks at local governments.
</p>

<p class="paragraph inline-placeholder" data-uri="cms.cnn.com/_components/paragraph/instances/paragraph_47664B52-91D3-A4D7-E092-16BA9065C6E1@published" data-editable="text" data-component-name="paragraph" data-analytics-observe="on">
    The People’s Bank of China, the financial regulator and the securities regulator jointly pledged to work together on tackle this challenge, according to <a href="http://www.pbc.gov.cn/goutongjiaoliu/113456/113469/5033430/index.html" target="_blank">a statement</a> by the central bank.
</p>

<h2 class="subheader" data-editable="text" data-uri="cms.cnn.com/_components/subheader/instances/paragraph_2D0EA3CC-1103-5950-2F23-16C8C287C7A7@published" data-component-name="subheader" id="demographic-decline">
  Demographic decline
</h2>

<p class="paragraph inline-placeholder" data-uri="cms.cnn.com/_components/paragraph/instances/paragraph_01DEDE8F-33FF-0990-9DAD-16BA118E6B08@published" data-editable="text" data-component-name="paragraph" data-analytics-observe="on">
    What’s more, China faces some long term challenges, such as a population crisis, and strained relations with key trading partners such as the United States and Europe.
</p>

<p class="paragraph inline-placeholder" data-uri="cms.cnn.com/_components/paragraph/instances/paragraph_3B7C3EA7-DC05-29AE-499D-16C9A00F556F@published" data-editable="text" data-component-name="paragraph" data-analytics-observe="on">
    The country’s total fertility rate, the average number of babies a woman<strong> </strong>will<strong> </strong>have over her lifetime, dropped to a record low of 1.09 last year from 1.30 just two years before, according to a recent report by state-owned Jiemian.com, citing a study by a unit of the National Health Commission.
</p>

<p class="paragraph inline-placeholder" data-uri="cms.cnn.com/_components/paragraph/instances/paragraph_71EE0208-0C7B-D16C-B84F-16CB4D1C4390@published" data-editable="text" data-component-name="paragraph" data-analytics-observe="on">
    That means China’s fertility rate is now even lower than Japan’s, a country long known for its aging society.
</p>

<p class="paragraph inline-placeholder" data-uri="cms.cnn.com/_components/paragraph/instances/paragraph_D3DB8C91-147E-3B9E-4140-16D3F648EBBC@published" data-editable="text" data-component-name="paragraph" data-analytics-observe="on">
    Earlier this year, China released data that showed its population <a href="https://www.cnn.com/2023/01/16/economy/china-population-decline-sixty-years-intl-hnk/index.html#:~:text=Shoppers%20at%20a%20market%20in%20Dali%2C%20Yunnan%20on%20January%2014.&amp;text=China's%20population%20shrank%20in%202022,implications%20for%20its%20slowing%20economy." target="_blank">started shrinking last year</a> for the first in six decades.
</p>

<p class="paragraph inline-placeholder" data-uri="cms.cnn.com/_components/paragraph/instances/paragraph_BDE1F102-AD50-06CA-F0A0-16CC4A39B292@published" data-editable="text" data-component-name="paragraph" data-analytics-observe="on">
    “China’s aging demographics present significant challenges to its economic growth potential,” said analysts from Moody’s Investors Service in a research report last week.
</p>

<p class="paragraph inline-placeholder" data-uri="cms.cnn.com/_components/paragraph/instances/paragraph_261971A2-8EC2-0A1B-8D23-16D0C0286EF8@published" data-editable="text" data-component-name="paragraph" data-analytics-observe="on">
    The decline in labor supply and increased healthcare and social spending could lead to a wider fiscal deficit and higher debt burden. A smaller workforce could also erode domestic savings, resulting in higher interest rates and declining investment. 
</p>

<p class="paragraph inline-placeholder" data-uri="cms.cnn.com/_components/paragraph/instances/paragraph_7E4A0271-3190-6189-C4B3-16D2EE3B4A2B@published" data-editable="text" data-component-name="paragraph" data-analytics-observe="on">
    “Housing demand will fall in the long term,” they added.
</p>

<p class="paragraph inline-placeholder" data-uri="cms.cnn.com/_components/paragraph/instances/paragraph_7CDB5F79-3B90-B710-1D25-172D2A8D3F3D@published" data-editable="text" data-component-name="paragraph" data-analytics-observe="on">
    Demographics, along with slowing migration from the countryside to urban areas and geopolitical fracturing, are “structural in nature” and largely outside of policymakers’ control, Evans-Pritchard said. 
</p>

<p class="paragraph inline-placeholder" data-uri="cms.cnn.com/_components/paragraph/instances/paragraph_59590631-8C07-D358-D4A9-16E434B11E4F@published" data-editable="text" data-component-name="paragraph" data-analytics-observe="on">
    “The big picture is that trend growth has fallen substantially since the start of the pandemic and looks set to decline further over the medium-term,” he said.
</p>

              </div>
              <div class="article__copyright" data-editable="copyright" itemprop="articleCopyright" data-reorderable="copyright">
                
              </div>
          </div>
  </main>
</section>
</article>

</section>
        <section class="layout__end layout-with-rail__end" data-editable="end" data-track-zone="end">    <div data-uri="cms.cnn.com/_components/toast-popup/instances/cnn-recirc-toast-v1@published" class="toast-popup__container toast-popup" data-visible-viewport="mobile" data-page-types="article">
      <div class="toast-popup__controls-container">
          <div class="toast-popup__brand-logo">
              <svg width="45px" height="45px" viewBox="0 0 52 24" version="1.1" xmlns="http://www.w3.org/2000/svg"><g id="Prototype-1---Initial-Concept-Survey" stroke="none" stroke-width="1" fill="none" fill-rule="evenodd"><g id="Homepage" transform="translate(-120.000000, -18.000000)" fill="#CC0000" fill-rule="nonzero"><g id="Header"><g id="CNN-logo" transform="translate(120.000000, 18.000000)"><path d="M48.7378022,0.136483516 L48.7378022,19.4841758 C48.7378022,20.2892308 48.2327473,20.9683516 47.4810989,21.1734066 C47.3362492,21.2127827 47.1868096,21.2327375 47.0367033,21.2327473 C46.4663736,21.2327473 45.8123077,20.9505495 45.3402198,20.1494505 L40.527033,11.847033 L36.2413187,4.46241758 C36.0085714,4.06681319 35.6914286,3.87956044 35.3927473,3.96065934 C35.2028571,4.01274725 34.9813187,4.19802198 34.9813187,4.55010989 L34.9813187,19.4841758 C34.9813187,20.2892308 34.4762637,20.9683516 33.7246154,21.1734066 C33.0837363,21.3474725 32.1850549,21.1734066 31.5837363,20.1494505 C31.56,20.1079121 29.7949451,17.067033 27.1061538,12.4305495 L22.4835165,4.46241758 C22.2501099,4.06681319 21.9296703,3.8789011 21.6263736,3.96131868 C21.4351648,4.01340659 21.2116484,4.19934066 21.2116484,4.54945055 L21.2116484,19.1584615 C21.2116484,20.1632967 20.3287912,21.0454945 19.3226374,21.0454945 L11.9037363,21.0454945 C6.92571429,21.0454945 2.87538462,16.9951648 2.87538462,12.0171429 C2.87538462,7.03912088 6.92571429,2.98879121 11.9037363,2.98879121 L15.7556044,2.98879121 L15.7556044,0.136483516 L11.907033,0.136483516 C5.345526,0.136483516 0.0263736264,5.45563589 0.0263736264,12.0171429 C0.0263736264,18.5786498 5.345526,23.8978022 11.907033,23.8978022 L19.3951648,23.8978022 C22.2408791,23.8978022 24.0718681,22.2316484 24.0685714,19.1551648 L24.0685714,12.3791209 C24.0685714,12.3791209 28.8441758,20.607033 29.0643956,20.9795604 C32.0973626,26.1303297 37.8263736,24.001978 37.8263736,19.5679121 L37.8263736,12.3810989 C37.8263736,12.3810989 42.6026374,20.609011 42.8215385,20.9815385 C45.8545055,26.1323077 51.5835165,24.003956 51.5841758,19.5698901 L51.5841758,0.136483516 L48.7378022,0.136483516 Z" id="Path"></path><path d="M6.9,12.0171429 C6.90036411,9.23643422 9.15467595,6.98241756 11.9353846,6.98241758 L15.7556044,6.98241758 L15.7556044,4.13010989 L11.9037363,4.13010989 C9.08597062,4.13010965 6.48224769,5.63336959 5.0733648,8.07362618 C3.66448191,10.5138828 3.66448191,13.5204029 5.0733648,15.9606595 C6.48224769,18.4009161 9.08597062,19.9041761 11.9037363,19.9041758 L19.3232967,19.9041758 C19.738022,19.9041758 20.070989,19.4967033 20.070989,19.1584615 L20.070989,4.55010989 C20.070989,3.74505495 20.576044,3.06593407 21.3276923,2.86153846 C21.9692308,2.68681319 22.8679121,2.86153846 23.4685714,3.88483516 C23.4969231,3.93164835 25.3186813,7.07274725 28.0951648,11.8589011 C30.2742857,15.6171429 32.5292308,19.5032967 32.5694505,19.5731868 C32.8028571,19.9687912 33.1226374,20.1567033 33.4265934,20.0742857 C33.6184615,20.0221978 33.8426374,19.8369231 33.8426374,19.4854945 L33.8426374,4.55010989 C33.8426374,3.74373626 34.3457143,3.06461538 35.0953846,2.86087912 C35.7323077,2.68747253 36.627033,2.86483516 37.227033,3.88483516 C37.2540659,3.92967033 38.8648352,6.70681319 41.5127473,11.276044 C43.8567033,15.3158242 46.2797802,19.4947253 46.3259341,19.5718681 C46.5593407,19.9674725 46.8797802,20.1553846 47.1830769,20.072967 C47.3749451,20.0208791 47.5991209,19.8356044 47.5991209,19.4848352 L47.5991209,0.136483516 L44.7402198,0.136483516 L44.7402198,11.6551648 C44.7402198,11.6551648 39.9606593,3.42923077 39.7424176,3.05406593 C36.7094505,-2.0967033 30.9804396,0.0323076923 30.9804396,4.46637363 L30.9804396,11.6531868 C30.9804396,11.6531868 26.2041758,3.42923077 25.9826374,3.05406593 C22.9496703,-2.0967033 17.2206593,0.0323076923 17.2206593,4.46637363 L17.2206593,16.2494505 C17.2256713,16.4618128 17.1442918,16.6671184 16.9951473,16.8183757 C16.8460029,16.9696331 16.6418623,17.0538925 16.4294505,17.0518681 L11.9386813,17.0518681 C10.6027574,17.0527428 9.3212405,16.5227072 8.37622855,15.5784372 C7.43121659,14.6341672 6.90017464,13.353067 6.9,12.0171429 L6.9,12.0171429 Z" id="Path"></path></g></g></g></g></svg>
          </div>
          <div class="toast-popup__header">Related</div>
          <div class="toast-popup__close-icon">
              <svg class="icon-ui-close-thick" width="24" height="24" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="M12 2c.825 0 1.5.75 1.5 1.667V10.5h6.833c.917 0 1.667.675 1.667 1.5s-.75 1.5-1.667 1.5H13.5v6.833C13.5 21.25 12.825 22 12 22s-1.5-.75-1.5-1.667V13.5H3.667C2.75 13.5 2 12.825 2 12s.75-1.5 1.667-1.5H10.5V3.667C10.5 2.75 11.175 2 12 2z"></path></svg>

          </div>
      </div>

      <div class="toast-popup__content" role="region" data-editable="content" aria-hidden="true">
            <div data-uri="cms.cnn.com/_components/personalized-recirc/instances/cnn-recirc-toast-v1@published" class="personalized-recirc personalized-recirc" data-visible-viewport="" data-editable="settings">
<div class="personalized-recirc__text-container">
  <a class="personalied-recirc__headline"></a>
</div>
<a class="personalized-recirc__image-container">
  <img class="personalized-recirc__image">
</a>
</div>
      </div>
  </div>


  <div data-uri="cms.cnn.com/_components/bizdev-dianomi/instances/cnn-business-v1-btf-smartfeed@published" class="bizdev-dianomi" data-editable="settings" data-visible-viewport="">
      <div class="dianomi_context" data-dianomi-context-id="524">
      </div>
  </div>


  

  


</section>
      </section>
      <section class="layout__rail layout-with-rail__rail" data-editable="rail" data-track-zone="rail" data-analytics-collection="right-rail">  


<div class="container container_list-headlines-with-images  " data-uri="cms.cnn.com/_components/container/instances/business-latest@published" data-selective-publishing="true" data-collapsed-text="More from CNN Business">
  <div class="container__ads container_list-headlines-with-images__ads">
        </div>
      <div class="container__kicker" data-editable="kicker">
      </div>
    <div class="container__title container_list-headlines-with-images__title " data-editable="titleLink">
      <h3 class="container__title-text container_list-headlines-with-images__title-text" data-editable="title">More from CNN Business</h3>
    </div>
  <div class="container_list-headlines-with-images__cards-wrapper">
    <div class="container__field-wrapper container_list-headlines-with-images__field-wrapper">
      <div class="container__field-links container_list-headlines-with-images__field-links" data-editable="cards">
              






<div data-uri="cms.cnn.com/_components/card/instances/business-latest_fill_1@published" data-created-updated-by="true" class="card container__item container__item--type-article container_list-headlines-with-images__item container_list-headlines-with-images__item--type-article " data-component-name="card" data-open-link="/2023/08/21/tech/arm-ipo/index.html" data-unselectable="true">
  
      
  <a href="/2023/08/21/tech/arm-ipo/index.html" class="container__link container_list-headlines-with-images__link" data-link-type="article">
                          <div class="container__item-media-wrapper container_list-headlines-with-images__item-media-wrapper" data-breakpoints="{&quot;card--media-large&quot;: 596}">
      <div class="container__item-media container_list-headlines-with-images__item-media">
                      <div data-uri="cms.cnn.com/_components/image/instances/card_business-latest_fill_1@published" class="image image__hide-placeholder" data-image-variation="image" data-name="masayoshi son 080719 file" data-component-name="image" data-observe-resizes="" data-breakpoints="{&quot;image--eq-extra-small&quot;: 115, &quot;image--eq-small&quot;: 300}" data-original-ratio="0.7372600926538716" data-original-height="3342" data-original-width="4533" data-url="https://media.cnn.com/api/v1/images/stellar/prod/200413124900-masayoshi-son-080719-file.jpg?c=original" data-unselectable="true">
    
  <div class="image__container " data-image-variation="image" data-breakpoints="{&quot;image--eq-extra-small&quot;: 115, &quot;image--eq-small&quot;: 300, &quot;image--show-credits&quot;: 596}">
     <picture class="image__picture"><source height="144" width="256" media="(min-width: 1280px)" srcset="https://media.cnn.com/api/v1/images/stellar/prod/200413124900-masayoshi-son-080719-file.jpg?c=16x9&amp;q=h_144,w_256,c_fill/f_webp" type="image/webp"><source height="144" width="256" media="(min-width: 960px)" srcset="https://media.cnn.com/api/v1/images/stellar/prod/200413124900-masayoshi-son-080719-file.jpg?c=16x9&amp;q=h_144,w_256,c_fill/f_webp" type="image/webp"><source height="144" width="256" media="(-webkit-min-device-pixel-ratio: 2)" srcset="https://media.cnn.com/api/v1/images/stellar/prod/200413124900-masayoshi-son-080719-file.jpg?c=16x9&amp;q=h_144,w_256,c_fill/f_webp" type="image/webp"><img src="https://media.cnn.com/api/v1/images/stellar/prod/200413124900-masayoshi-son-080719-file.jpg?c=16x9&amp;q=h_144,w_256,c_fill" alt="Softbank group CEO Masayoshi Son answers a question during a press conference to announce the company's financial results in Tokyo on August 7, 2019. - Japan's SoftBank Group said on August 7 its first-quarter net profit more than tripled thanks to exceptional gains related to the sale of shares in Chinese e-commerce giant Alibaba. (Photo by Toshifumi KITAMURA / AFP)        (Photo credit should read TOSHIFUMI KITAMURA/AFP via Getty Images)" class="image__dam-img" onload="this.classList.remove('image__dam-img--loading')" onerror="imageLoadError(this)" height="3342" width="4533"></picture>
  </div>
  
    <div class="image__metadata">
      
      <figcaption class="image__credit">TOSHIFUMI KITAMURA/AFP via Getty Images</figcaption>
    </div>
  
</div>

      </div>
  </div>
  </a>
          <a href="/2023/08/21/tech/arm-ipo/index.html" class="container__link container_list-headlines-with-images__link" data-link-type="article">
              <div class="container__text container_list-headlines-with-images__text">
          <div class="container__headline container_list-headlines-with-images__headline">
                  <span data-editable="headline">Arm’s mega IPO could be just around the corner, a year after the biggest chip deal in history fell apart</span>
          </div>
              <div class="container__date container_list-headlines-with-images__date inline-placeholder">
                  Aug 22, 2023
              </div>
      </div>
  </a>
</div>

              






<div data-uri="cms.cnn.com/_components/card/instances/business-latest_fill_2@published" data-created-updated-by="true" class="card container__item container__item--type-article container_list-headlines-with-images__item container_list-headlines-with-images__item--type-article " data-component-name="card" data-open-link="/2023/08/21/business/zoom-earnings-ai-tools/index.html" data-unselectable="true">
  
      
  <a href="/2023/08/21/business/zoom-earnings-ai-tools/index.html" class="container__link container_list-headlines-with-images__link" data-link-type="article">
                          <div class="container__item-media-wrapper container_list-headlines-with-images__item-media-wrapper" data-breakpoints="{&quot;card--media-large&quot;: 596}">
      <div class="container__item-media container_list-headlines-with-images__item-media">
                      <div data-uri="cms.cnn.com/_components/image/instances/card_business-latest_fill_2@published" class="image image__hide-placeholder" data-image-variation="image" data-name="zoom headquarters" data-component-name="image" data-observe-resizes="" data-breakpoints="{&quot;image--eq-extra-small&quot;: 115, &quot;image--eq-small&quot;: 300}" data-original-ratio="0.6926666666666667" data-original-height="2078" data-original-width="3000" data-url="https://media.cnn.com/api/v1/images/stellar/prod/230821170639-zoom-headquarters.jpg?c=original" data-unselectable="true">
    
  <div class="image__container " data-image-variation="image" data-breakpoints="{&quot;image--eq-extra-small&quot;: 115, &quot;image--eq-small&quot;: 300, &quot;image--show-credits&quot;: 596}">
     <picture class="image__picture"><source height="144" width="256" media="(min-width: 1280px)" srcset="https://media.cnn.com/api/v1/images/stellar/prod/230821170639-zoom-headquarters.jpg?c=16x9&amp;q=h_144,w_256,c_fill/f_webp" type="image/webp"><source height="144" width="256" media="(min-width: 960px)" srcset="https://media.cnn.com/api/v1/images/stellar/prod/230821170639-zoom-headquarters.jpg?c=16x9&amp;q=h_144,w_256,c_fill/f_webp" type="image/webp"><source height="144" width="256" media="(-webkit-min-device-pixel-ratio: 2)" srcset="https://media.cnn.com/api/v1/images/stellar/prod/230821170639-zoom-headquarters.jpg?c=16x9&amp;q=h_144,w_256,c_fill/f_webp" type="image/webp"><img src="https://media.cnn.com/api/v1/images/stellar/prod/230821170639-zoom-headquarters.jpg?c=16x9&amp;q=h_144,w_256,c_fill" alt="SAN JOSE, CALIFORNIA - FEBRUARY 07: A sign is posted on the exterior of Zoom headquarters on February 07, 2023 in San Jose, California. Zoom Video Communications announced plans to cut 15 percent of its workforce, an estimated 1,300 people. (Photo by Justin Sullivan/Getty Images)" class="image__dam-img" onload="this.classList.remove('image__dam-img--loading')" onerror="imageLoadError(this)" height="2078" width="3000"></picture>
  </div>
  
    <div class="image__metadata">
      
      <figcaption class="image__credit">Justin Sullivan/Getty Images</figcaption>
    </div>
  
</div>

      </div>
  </div>
  </a>
          <a href="/2023/08/21/business/zoom-earnings-ai-tools/index.html" class="container__link container_list-headlines-with-images__link" data-link-type="article">
              <div class="container__text container_list-headlines-with-images__text">
          <div class="container__headline container_list-headlines-with-images__headline">
                  <span data-editable="headline">Zoom shares jump as CEO says company to develop and deploy AI tools</span>
          </div>
              <div class="container__date container_list-headlines-with-images__date inline-placeholder">
                  Aug 21, 2023
              </div>
      </div>
  </a>
</div>

      </div>
    </div>
  </div>

</div>

  <div class="ad-slot-rail" data-uri="cms.cnn.com/_components/ad-slot-rail/instances/cnn-v1@published">
      <div class="ad-slot-rail__container" style="top: 44px;">
          <div data-uri="cms.cnn.com/_components/ad-slot/instances/cnn-v1@published" class="ad-slot" data-path="rail/ad-slot-rail[0]/items" data-desktop-slot-id="ad_rect_atf_01" data-unselectable="true"><div id="ad_rect_atf_01" class="ad adfuel-rendered" data-google-query-id="CKvqzZPf74ADFepVnQkdg-cMsA" style="display: none;"><div id="google_ads_iframe_/8663477/blockthrough/CNNi/business_1__container__" style="border: 0pt none; width: 300px; height: 0px;"></div></div>
      <div class="ad-slot__feedback ad-feedback-link-container" style="width: 70%;">
          <div class="ad-slot__ad-label"></div>
           
<div data-ad-type="DISPLAY" data-ad-identifier="ad_rect_atf_01" class="ad-feedback-link">
  <div class="ad-feedback-link__label">Ad Feedback</div>
</div> 
      </div>
  </div>

      </div>
  </div>




<div class="container container_list-headlines-with-images  " data-uri="cms.cnn.com/_components/container/instances/business-latest-videos@published" data-selective-publishing="true" data-collapsed-text="CNN Business Videos">
  <div class="container__ads container_list-headlines-with-images__ads">
        </div>
      <div class="container__kicker" data-editable="kicker">
      </div>
    <div class="container__title container_list-headlines-with-images__title " data-editable="titleLink">
      <h3 class="container__title-text container_list-headlines-with-images__title-text" data-editable="title">CNN Business Videos</h3>
    </div>
  <div class="container_list-headlines-with-images__cards-wrapper">
    <div class="container__field-wrapper container_list-headlines-with-images__field-wrapper">
      <div class="container__field-links container_list-headlines-with-images__field-links" data-editable="cards">
              






<div data-uri="cms.cnn.com/_components/card/instances/business-latest-videos_fill_1@published" data-created-updated-by="true" class="card container__item container__item--type-article container_list-headlines-with-images__item container_list-headlines-with-images__item--type-article " data-component-name="card" data-open-link="/videos/business/2023/08/21/exp-china-economic-slowdown-lee-live-082103pseg2-cnni-business.cnn" data-unselectable="true">
  
      
  <a href="/videos/business/2023/08/21/exp-china-economic-slowdown-lee-live-082103pseg2-cnni-business.cnn" class="container__link container_list-headlines-with-images__link" data-link-type="video">
                          <div class="container__item-media-wrapper container_list-headlines-with-images__item-media-wrapper" data-breakpoints="{&quot;card--media-large&quot;: 596}">
      <div class="container__item-media container_list-headlines-with-images__item-media">
                      <div data-uri="cms.cnn.com/_components/image/instances/card_business-latest-videos_fill_1@published" class="image image__hide-placeholder" data-image-variation="image" data-name="exp china economic slowdown lee live 082103PSEG2 cnni business_00001701" data-component-name="image" data-observe-resizes="" data-breakpoints="{&quot;image--eq-extra-small&quot;: 115, &quot;image--eq-small&quot;: 300}" data-original-ratio="0.5625" data-original-height="1080" data-original-width="1920" data-url="https://media.cnn.com/api/v1/images/stellar/prod/230821163741-exp-china-economic-slowdown-lee-live-082103pseg2-cnni-business-00001701.png?c=original" data-unselectable="true">
    
  <div class="image__container " data-image-variation="image" data-breakpoints="{&quot;image--eq-extra-small&quot;: 115, &quot;image--eq-small&quot;: 300, &quot;image--show-credits&quot;: 596}">
     <picture class="image__picture"><source height="144" width="256" media="(min-width: 1280px)" srcset="https://media.cnn.com/api/v1/images/stellar/prod/230821163741-exp-china-economic-slowdown-lee-live-082103pseg2-cnni-business-00001701.png?c=16x9&amp;q=h_144,w_256,c_fill/f_webp" type="image/webp"><source height="144" width="256" media="(min-width: 960px)" srcset="https://media.cnn.com/api/v1/images/stellar/prod/230821163741-exp-china-economic-slowdown-lee-live-082103pseg2-cnni-business-00001701.png?c=16x9&amp;q=h_144,w_256,c_fill/f_webp" type="image/webp"><source height="144" width="256" media="(-webkit-min-device-pixel-ratio: 2)" srcset="https://media.cnn.com/api/v1/images/stellar/prod/230821163741-exp-china-economic-slowdown-lee-live-082103pseg2-cnni-business-00001701.png?c=16x9&amp;q=h_144,w_256,c_fill/f_webp" type="image/webp"><img src="https://media.cnn.com/api/v1/images/stellar/prod/230821163741-exp-china-economic-slowdown-lee-live-082103pseg2-cnni-business-00001701.png?c=16x9&amp;q=h_144,w_256,c_fill" alt="exp china economic slowdown lee live 082103PSEG2 cnni business_00001701.png" class="image__dam-img" onload="this.classList.remove('image__dam-img--loading')" onerror="imageLoadError(this)" height="1080" width="1920"></picture>
  </div>
  <div class="image__metadata"></div>
  
</div>

      </div>
  </div>
  </a>
          <a href="/videos/business/2023/08/21/exp-china-economic-slowdown-lee-live-082103pseg2-cnni-business.cnn" class="container__link container_list-headlines-with-images__link" data-link-type="video">
              <div class="container__text container_list-headlines-with-images__text">
          <div class="container__headline container_list-headlines-with-images__headline">
                              <svg class="icon-sig-video" width="24" height="24" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="M12 3.333c-4.779 0-8.667 3.888-8.667 8.667S7.221 20.667 12 20.667s8.667-3.888 8.667-8.667S16.779 3.333 12 3.333M12 22C6.486 22 2 17.514 2 12S6.486 2 12 2s10 4.486 10 10-4.486 10-10 10m-1.064-6.793l4.61-2.74a.715.715 0 00-.003-1.23l-4.61-2.712a.714.714 0 00-1.076.616v5.452c0 .554.603.897 1.08.614"></path></svg>

                  <span data-editable="headline">Lee: China’s economic slowdown won’t badly hurt Western economies</span>
          </div>
              <div class="container__date container_list-headlines-with-images__date inline-placeholder">
                  Aug 21, 2023
              </div>
      </div>
  </a>
</div>

              






<div data-uri="cms.cnn.com/_components/card/instances/business-latest-videos_fill_2@published" data-created-updated-by="true" class="card container__item container__item--type-article container_list-headlines-with-images__item container_list-headlines-with-images__item--type-article " data-component-name="card" data-open-link="/videos/business/2023/08/21/exp-fires-maui-tourism-wilkins-live-082103pseg1-cnni-business.cnn" data-unselectable="true">
  
      
  <a href="/videos/business/2023/08/21/exp-fires-maui-tourism-wilkins-live-082103pseg1-cnni-business.cnn" class="container__link container_list-headlines-with-images__link" data-link-type="video">
                          <div class="container__item-media-wrapper container_list-headlines-with-images__item-media-wrapper" data-breakpoints="{&quot;card--media-large&quot;: 596}">
      <div class="container__item-media container_list-headlines-with-images__item-media">
                      <div data-uri="cms.cnn.com/_components/image/instances/card_business-latest-videos_fill_2@published" class="image image__hide-placeholder" data-image-variation="image" data-name="exp fires maui tourism wilkins live 082103PSEG1 cnni business_00002101" data-component-name="image" data-observe-resizes="" data-breakpoints="{&quot;image--eq-extra-small&quot;: 115, &quot;image--eq-small&quot;: 300}" data-original-ratio="0.5625" data-original-height="1080" data-original-width="1920" data-url="https://media.cnn.com/api/v1/images/stellar/prod/230821161417-exp-fires-maui-tourism-wilkins-live-082103pseg1-cnni-business-00002101.png?c=original" data-unselectable="true">
    
  <div class="image__container " data-image-variation="image" data-breakpoints="{&quot;image--eq-extra-small&quot;: 115, &quot;image--eq-small&quot;: 300, &quot;image--show-credits&quot;: 596}">
     <picture class="image__picture"><source height="144" width="256" media="(min-width: 1280px)" srcset="https://media.cnn.com/api/v1/images/stellar/prod/230821161417-exp-fires-maui-tourism-wilkins-live-082103pseg1-cnni-business-00002101.png?c=16x9&amp;q=h_144,w_256,c_fill/f_webp" type="image/webp"><source height="144" width="256" media="(min-width: 960px)" srcset="https://media.cnn.com/api/v1/images/stellar/prod/230821161417-exp-fires-maui-tourism-wilkins-live-082103pseg1-cnni-business-00002101.png?c=16x9&amp;q=h_144,w_256,c_fill/f_webp" type="image/webp"><source height="144" width="256" media="(-webkit-min-device-pixel-ratio: 2)" srcset="https://media.cnn.com/api/v1/images/stellar/prod/230821161417-exp-fires-maui-tourism-wilkins-live-082103pseg1-cnni-business-00002101.png?c=16x9&amp;q=h_144,w_256,c_fill/f_webp" type="image/webp"><img src="https://media.cnn.com/api/v1/images/stellar/prod/230821161417-exp-fires-maui-tourism-wilkins-live-082103pseg1-cnni-business-00002101.png?c=16x9&amp;q=h_144,w_256,c_fill" alt="exp fires maui tourism wilkins live 082103PSEG1 cnni business_00002101.png" class="image__dam-img" onload="this.classList.remove('image__dam-img--loading')" onerror="imageLoadError(this)" height="1080" width="1920"></picture>
  </div>
  <div class="image__metadata"></div>
  
</div>

      </div>
  </div>
  </a>
          <a href="/videos/business/2023/08/21/exp-fires-maui-tourism-wilkins-live-082103pseg1-cnni-business.cnn" class="container__link container_list-headlines-with-images__link" data-link-type="video">
              <div class="container__text container_list-headlines-with-images__text">
          <div class="container__headline container_list-headlines-with-images__headline">
                              <svg class="icon-sig-video" width="24" height="24" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="M12 3.333c-4.779 0-8.667 3.888-8.667 8.667S7.221 20.667 12 20.667s8.667-3.888 8.667-8.667S16.779 3.333 12 3.333M12 22C6.486 22 2 17.514 2 12S6.486 2 12 2s10 4.486 10 10-4.486 10-10 10m-1.064-6.793l4.61-2.74a.715.715 0 00-.003-1.23l-4.61-2.712a.714.714 0 00-1.076.616v5.452c0 .554.603.897 1.08.614"></path></svg>

                  <span data-editable="headline">Devastating fires in Maui raise post-disaster tourism debate</span>
          </div>
              <div class="container__date container_list-headlines-with-images__date inline-placeholder">
                  Aug 21, 2023
              </div>
      </div>
  </a>
</div>

              






<div data-uri="cms.cnn.com/_components/card/instances/business-latest-videos_fill_3@published" data-created-updated-by="true" class="card container__item container__item--type-article container_list-headlines-with-images__item container_list-headlines-with-images__item--type-article " data-component-name="card" data-open-link="/videos/business/2023/08/21/exp-fashion-resale-apps-stewart-pkg-081902aseg2-cnni-business.cnn" data-unselectable="true">
  
      
  <a href="/videos/business/2023/08/21/exp-fashion-resale-apps-stewart-pkg-081902aseg2-cnni-business.cnn" class="container__link container_list-headlines-with-images__link" data-link-type="video">
                          <div class="container__item-media-wrapper container_list-headlines-with-images__item-media-wrapper" data-breakpoints="{&quot;card--media-large&quot;: 596}">
      <div class="container__item-media container_list-headlines-with-images__item-media">
                      <div data-uri="cms.cnn.com/_components/image/instances/card_business-latest-videos_fill_3@published" class="image image__hide-placeholder" data-image-variation="image" data-name="exp fashion resale apps stewart pkg 081902ASEG2 cnni business_00002814" data-component-name="image" data-observe-resizes="" data-breakpoints="{&quot;image--eq-extra-small&quot;: 115, &quot;image--eq-small&quot;: 300}" data-original-ratio="0.5625" data-original-height="1080" data-original-width="1920" data-url="https://media.cnn.com/api/v1/images/stellar/prod/230821084013-exp-fashion-resale-apps-stewart-pkg-081902aseg2-cnni-business-00002814.png?c=original" data-unselectable="true">
    
  <div class="image__container " data-image-variation="image" data-breakpoints="{&quot;image--eq-extra-small&quot;: 115, &quot;image--eq-small&quot;: 300, &quot;image--show-credits&quot;: 596}">
     <picture class="image__picture"><source height="144" width="256" media="(min-width: 1280px)" srcset="https://media.cnn.com/api/v1/images/stellar/prod/230821084013-exp-fashion-resale-apps-stewart-pkg-081902aseg2-cnni-business-00002814.png?c=16x9&amp;q=h_144,w_256,c_fill/f_webp" type="image/webp"><source height="144" width="256" media="(min-width: 960px)" srcset="https://media.cnn.com/api/v1/images/stellar/prod/230821084013-exp-fashion-resale-apps-stewart-pkg-081902aseg2-cnni-business-00002814.png?c=16x9&amp;q=h_144,w_256,c_fill/f_webp" type="image/webp"><source height="144" width="256" media="(-webkit-min-device-pixel-ratio: 2)" srcset="https://media.cnn.com/api/v1/images/stellar/prod/230821084013-exp-fashion-resale-apps-stewart-pkg-081902aseg2-cnni-business-00002814.png?c=16x9&amp;q=h_144,w_256,c_fill/f_webp" type="image/webp"><img src="https://media.cnn.com/api/v1/images/stellar/prod/230821084013-exp-fashion-resale-apps-stewart-pkg-081902aseg2-cnni-business-00002814.png?c=16x9&amp;q=h_144,w_256,c_fill" alt="exp fashion resale apps stewart pkg 081902ASEG2 cnni business_00002814.png" class="image__dam-img" onload="this.classList.remove('image__dam-img--loading')" onerror="imageLoadError(this)" height="1080" width="1920"></picture>
  </div>
  <div class="image__metadata"></div>
  
</div>

      </div>
  </div>
  </a>
          <a href="/videos/business/2023/08/21/exp-fashion-resale-apps-stewart-pkg-081902aseg2-cnni-business.cnn" class="container__link container_list-headlines-with-images__link" data-link-type="video">
              <div class="container__text container_list-headlines-with-images__text">
          <div class="container__headline container_list-headlines-with-images__headline">
                              <svg class="icon-sig-video" width="24" height="24" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="M12 3.333c-4.779 0-8.667 3.888-8.667 8.667S7.221 20.667 12 20.667s8.667-3.888 8.667-8.667S16.779 3.333 12 3.333M12 22C6.486 22 2 17.514 2 12S6.486 2 12 2s10 4.486 10 10-4.486 10-10 10m-1.064-6.793l4.61-2.74a.715.715 0 00-.003-1.23l-4.61-2.712a.714.714 0 00-1.076.616v5.452c0 .554.603.897 1.08.614"></path></svg>

                  <span data-editable="headline">Vinted and Depop push to make fashion more sustainable</span>
          </div>
              <div class="container__date container_list-headlines-with-images__date inline-placeholder">
                  Aug 21, 2023
              </div>
      </div>
  </a>
</div>

              






<div data-uri="cms.cnn.com/_components/card/instances/business-latest-videos_fill_4@published" data-created-updated-by="true" class="card container__item container__item--type-article container_list-headlines-with-images__item container_list-headlines-with-images__item--type-article " data-component-name="card" data-open-link="/videos/business/2023/08/21/exp-weight-loss-drugs-denmark-stewart-live-fst-082109aseg2-cnni-business.cnn" data-unselectable="true">
  
      
  <a href="/videos/business/2023/08/21/exp-weight-loss-drugs-denmark-stewart-live-fst-082109aseg2-cnni-business.cnn" class="container__link container_list-headlines-with-images__link" data-link-type="video">
                          <div class="container__item-media-wrapper container_list-headlines-with-images__item-media-wrapper" data-breakpoints="{&quot;card--media-large&quot;: 596}">
      <div class="container__item-media container_list-headlines-with-images__item-media">
                      <div data-uri="cms.cnn.com/_components/image/instances/card_business-latest-videos_fill_4@published" class="image image__hide-placeholder" data-image-variation="image" data-name="exp weight loss drugs denmark stewart live FST 082109ASEG2 cnni business_00005223" data-component-name="image" data-observe-resizes="" data-breakpoints="{&quot;image--eq-extra-small&quot;: 115, &quot;image--eq-small&quot;: 300}" data-original-ratio="0.5625" data-original-height="1080" data-original-width="1920" data-url="https://media.cnn.com/api/v1/images/stellar/prod/230821120601-exp-weight-loss-drugs-denmark-stewart-live-fst-082109aseg2-cnni-business-00005223.png?c=original" data-unselectable="true">
    
  <div class="image__container " data-image-variation="image" data-breakpoints="{&quot;image--eq-extra-small&quot;: 115, &quot;image--eq-small&quot;: 300, &quot;image--show-credits&quot;: 596}">
     <picture class="image__picture"><source height="144" width="256" media="(min-width: 1280px)" srcset="https://media.cnn.com/api/v1/images/stellar/prod/230821120601-exp-weight-loss-drugs-denmark-stewart-live-fst-082109aseg2-cnni-business-00005223.png?c=16x9&amp;q=h_144,w_256,c_fill/f_webp" type="image/webp"><source height="144" width="256" media="(min-width: 960px)" srcset="https://media.cnn.com/api/v1/images/stellar/prod/230821120601-exp-weight-loss-drugs-denmark-stewart-live-fst-082109aseg2-cnni-business-00005223.png?c=16x9&amp;q=h_144,w_256,c_fill/f_webp" type="image/webp"><source height="144" width="256" media="(-webkit-min-device-pixel-ratio: 2)" srcset="https://media.cnn.com/api/v1/images/stellar/prod/230821120601-exp-weight-loss-drugs-denmark-stewart-live-fst-082109aseg2-cnni-business-00005223.png?c=16x9&amp;q=h_144,w_256,c_fill/f_webp" type="image/webp"><img src="https://media.cnn.com/api/v1/images/stellar/prod/230821120601-exp-weight-loss-drugs-denmark-stewart-live-fst-082109aseg2-cnni-business-00005223.png?c=16x9&amp;q=h_144,w_256,c_fill" alt="exp weight loss drugs denmark stewart live FST 082109ASEG2 cnni business_00005223.png" class="image__dam-img" onload="this.classList.remove('image__dam-img--loading')" onerror="imageLoadError(this)" height="1080" width="1920"></picture>
  </div>
  <div class="image__metadata"></div>
  
</div>

      </div>
  </div>
  </a>
          <a href="/videos/business/2023/08/21/exp-weight-loss-drugs-denmark-stewart-live-fst-082109aseg2-cnni-business.cnn" class="container__link container_list-headlines-with-images__link" data-link-type="video">
              <div class="container__text container_list-headlines-with-images__text">
          <div class="container__headline container_list-headlines-with-images__headline">
                              <svg class="icon-sig-video" width="24" height="24" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="M12 3.333c-4.779 0-8.667 3.888-8.667 8.667S7.221 20.667 12 20.667s8.667-3.888 8.667-8.667S16.779 3.333 12 3.333M12 22C6.486 22 2 17.514 2 12S6.486 2 12 2s10 4.486 10 10-4.486 10-10 10m-1.064-6.793l4.61-2.74a.715.715 0 00-.003-1.23l-4.61-2.712a.714.714 0 00-1.076.616v5.452c0 .554.603.897 1.08.614"></path></svg>

                  <span data-editable="headline">Weight loss drugs impact Denmark’s economy</span>
          </div>
              <div class="container__date container_list-headlines-with-images__date inline-placeholder">
                  Aug 21, 2023
              </div>
      </div>
  </a>
</div>

      </div>
    </div>
  </div>

</div>


  <div class="ad-slot-rail" data-uri="cms.cnn.com/_components/ad-slot-rail/instances/cnn-v2@published">
      <div class="ad-slot-rail__container" style="top: 44px;">
          <div data-uri="cms.cnn.com/_components/ad-slot/instances/cnn-v1@published" class="ad-slot adSlotLoaded" data-path="rail/ad-slot-rail[1]/items" data-desktop-slot-id="ad_rect_btf_01" data-unselectable="true"><div id="ad_rect_btf_01" class="ad up-show adfuel-rendered" data-google-query-id="CJP67f3e74ADFdVanQkdSZcELA"><div class="ahover" style="width: max-content !important; height: 600px; position: relative; z-index: 0; margin: 0px auto; display: block;"><iframe src="https://static.btloader.com/safeFrame.html?upapi=true" marginwidth="0" marginheight="0" scrolling="no" style="width: 300px; height: 600px; border: 0px;"></iframe><div class="upo-label" style="text-align: left; padding: 0px; margin: 0px; position: absolute; top: 0px; left: 0px; z-index: 10000; transition: opacity 1s ease-out 0s; opacity: 1; cursor: pointer; transform: none;"><span style="display:block;background:rgba(255, 255, 255, 0.7);height:fit-content;width:fit-content;top:0;left:0;color:#444;font-size:10px;font-weight:bold;font-family:sans-serif;line-height:normal;text-decoration:none;margin:0px;padding:6px;border-radius:0 0 5px 0;">AD</span></div></div><div id="google_ads_iframe_/8663477/blockthrough/CNNi/business_2__container__" style="border: 0pt none; display: inline-block; width: 1px; height: 1px;"><iframe frameborder="0" src="https://5c8247473269643bff1ffe31618c3c2b.safeframe.googlesyndication.com/safeframe/1-0-40/html/container.html?upapi=true" id="google_ads_iframe_/8663477/blockthrough/CNNi/business_2" title="advertisement" name="" scrolling="no" marginwidth="0" marginheight="0" width="1" height="1" data-is-safeframe="true" sandbox="allow-forms allow-popups allow-popups-to-escape-sandbox allow-same-origin allow-scripts allow-top-navigation-by-user-activation" role="region" aria-label="Advertisement" tabindex="0" data-google-container-id="3" style="border: 0px; vertical-align: bottom;" data-load-complete="true"></iframe></div></div>
      <div class="ad-slot__feedback ad-feedback-link-container" style="width: 300px;">
          <div class="ad-slot__ad-label"></div>
           
<div data-ad-type="DISPLAY" data-ad-identifier="ad_rect_btf_01" class="ad-feedback-link">
  <div class="ad-feedback-link__label">Ad Feedback</div>
</div> 
      </div>
  </div>

      </div>
  </div>

  <div data-uri="cms.cnn.com/_components/bizdev-dianomi/instances/cnn-business-v1-btf-right-rail@published" class="bizdev-dianomi" data-editable="settings" data-visible-viewport="desktop">
      <div class="dianomi_context" data-dianomi-context-id="633">
      </div>
  </div>

  <div class="ad-slot-rail" data-uri="cms.cnn.com/_components/ad-slot-rail/instances/cnn-v3@published">
      <div class="ad-slot-rail__container" style="top: 44px;">
          <div data-uri="cms.cnn.com/_components/ad-slot/instances/cnn-v1@published" class="ad-slot" data-path="rail/ad-slot-rail[2]/items" data-desktop-slot-id="ad_rect_btf_02" data-unselectable="true"><div id="ad_rect_btf_02" class="ad adfuel-rendered" data-google-query-id="CKWcypTf74ADFfNMnQkdrEYKhQ" style="display: none;"><div id="google_ads_iframe_/8663477/blockthrough/CNNi/business_3__container__" style="border: 0pt none; width: 300px; height: 0px;"></div></div>
      <div class="ad-slot__feedback ad-feedback-link-container" style="width: 70%;">
          <div class="ad-slot__ad-label"></div>
           
<div data-ad-type="DISPLAY" data-ad-identifier="ad_rect_btf_02" class="ad-feedback-link">
  <div class="ad-feedback-link__label">Ad Feedback</div>
</div> 
      </div>
  </div>

      </div>
  </div>

<div data-uri="cms.cnn.com/_components/bizdev-nativo/instances/nativo-v1@published" class="bizdev-nativo nativo" data-editable="settings" data-placement-ids="1175343">
  <div data-editable="placementNames.0.text" class="nativo-article-dle-rail-bin-a"></div>
</div>

<div data-uri="cms.cnn.com/_components/bizdev-nativo/instances/nativo-v2@published" class="bizdev-nativo nativo" data-editable="settings" data-placement-ids="1175344">
  <div data-editable="placementNames.0.text" class="nativo-article-dle-rail-bin-b"></div>
</div>



</section>
    </section>
    <div class="layout__bottom layout-with-rail__bottom" data-editable="bottom" data-track-zone="bottom">  <div data-uri="cms.cnn.com/_components/dynamic/instances/business-footer-nav-v1@published" data-editable="settings" class="dynamic">
            <div data-uri="cms.cnn.com/_components/dynamic-logic/instances/business-footer-nav-edition-v1@published">
      <div data-editable="mainComponent">
                <footer data-uri="cms.cnn.com/_components/footer/instances/business-v2@published" id="pageFooter" data-editable="settings" class="footer cnn-app-display-none" data-analytics-aggregate-events="true" data-analytics-observe="on">
<div class="footer__inner">
      <div class="search-bar" data-uri="cms.cnn.com/_components/search-bar/instances/new-cnn-footer-v1@published" data-editable="settings">
<form action="https://www.cnn.com/search" name="q" class="search-bar__form" role="search">
  <input placeholder="Search CNN..." aria-label="Search" class="search-bar__input" type="text" autocomplete="on" name="q" data-analytics-prop-click-action="search-query-edit">
  <button type="submit" class="search-bar__submit" title="Submit" data-analytics-prop-click-action="search-query-submit">
    <span class="search-bar__button-text">Search</span>
    <span class="search-bar__arrow"><svg class="icon-ui-arrow-right-thick" width="24" height="24" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="M14.003 3.471l7.464 7.303a1.73 1.73 0 010 2.498l-7.631 7.259c-.713.688-1.921.623-2.54-.194-.496-.654-.34-1.6.25-2.17l4.918-4.666H3.5c-.776 0-1.42-.598-1.493-1.356L2 12.001l.007-.144A1.505 1.505 0 013.5 10.501h12.972l-4.751-4.66c-.594-.573-.755-1.528-.252-2.183.62-.81 1.824-.872 2.534-.187z"></path></svg>
</span>
    <span class="search-bar__search-icon"><svg class="icon-ui-search" width="24" height="24" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="M5.068 10.427c0-2.953 2.394-5.356 5.338-5.356 2.943 0 5.338 2.403 5.338 5.356 0 2.952-2.395 5.355-5.338 5.355-2.944 0-5.338-2.403-5.338-5.355m14.697 8.201l-4.277-4.29a6.41 6.41 0 001.324-3.911c0-3.55-2.868-6.427-6.406-6.427S4 6.877 4 10.427c0 3.549 2.868 6.426 6.406 6.426a6.363 6.363 0 003.956-1.374l4.271 4.286a.799.799 0 001.132 0 .806.806 0 000-1.137"></path></svg>
</span>
  </button>
</form>
</div>

    <div id="headerAccountNavIcon" class="footer__user-account-nav-icon footer__user-account-nav-mobile">
      <nav class="user-account-nav user-account-nav--unauth" data-uri="cms.cnn.com/_components/user-account-nav/instances/user-account-nav@published" data-editable="settings" aria-label="User Account Nav" data-avatar-enabled="false" tabindex="0" style="visibility: visible;">
<div class="user-account-nav__icons">
  <button class="user-account-nav__icon-button user-account-nav__icon-button--auth userAccountButton" aria-haspopup="true" aria-expanded="false" aria-label="User Account Nav Button" data-zjs="click" data-zjs-component_id="user-account-nav__icon-button user-account-nav__icon-button--auth userAccountButton" data-zjs-component_text="User Account Nav Button" data-zjs-component_type="button" data-zjs-container_id="" data-zjs-container_type="navigation" data-zjs-destination_url="" data-zjs-page_type="article" data-zjs-page_variant="article_leaf" data-zjs-navigation-type="sub" data-zjs-navigation-location="footer">
    <svg class="icon-ui-avatar-fill" width="24" height="24" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" aria-label="User Avatar" role="img"><path d="M18.975 17.15c-.088-.38-.227-.563-.231-.572-.537-1.055-2.583-2.014-5.736-2.194 2.284-.622 3.806-3.113 2.79-5.727a3.94 3.94 0 00-2.233-2.233c-3.013-1.171-5.879 1.034-5.879 3.896a4.22 4.22 0 003.126 4.068c-3.118.189-5.142 1.143-5.674 2.191-.014.023-.114.173-.193.458-1.453-2.03-2.058-4.706-1.274-7.51.762-2.723 2.854-4.92 5.551-5.767C15.18 1.892 20.674 6.316 20.674 12a8.628 8.628 0 01-1.7 5.15M9.135 2.4a9.753 9.753 0 00-6.74 6.759c-1.09 3.92.169 7.628 2.68 10.043v.002l.03.027c2.433 2.321 6.026 3.435 9.813 2.353a9.752 9.752 0 006.686-6.734A10.038 10.038 0 009.134 2.4"></path></svg>

    <span class="userAccountFollowDot"></span>
  </button>
  <button class="user-account-nav__icon-button user-account-nav__icon-button--unauth userAccountButton" aria-haspopup="true" aria-expanded="false" role="link" data-login-href="/account/log-in" aria-label="User Account Log In Button" data-zjs="click" data-zjs-component_id="/account/log-in" data-zjs-component_text="User Account Log In Button" data-zjs-component_type="button" data-zjs-container_id="" data-zjs-container_type="navigation" data-zjs-destination_url="/account/log-in" data-zjs-page_type="article" data-zjs-page_variant="article_leaf" data-zjs-navigation-type="sub" data-zjs-navigation-location="footer">
    <svg class="icon-ui-avatar-default" width="24" height="24" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" aria-label="User Avatar" role="img"><path d="M12 20.674a8.654 8.654 0 01-6.483-2.92c.168-.397.523-.758 1.067-1.076 1.334-.782 3.268-1.23 5.305-1.23 2.027 0 3.955.445 5.288 1.22.628.365.998.787 1.125 1.283A8.649 8.649 0 0112 20.674m1.521-7.203c-3.033 1.496-6.04-1.51-4.544-4.543a2.831 2.831 0 011.282-1.282c3.032-1.491 6.035 1.512 4.543 4.543a2.833 2.833 0 01-1.28 1.282m1.69-9.564c2.334.85 4.161 2.752 4.958 5.106.974 2.873.47 5.65-.941 7.773-.307-.486-.765-.912-1.382-1.27-.912-.53-2.054-.922-3.303-1.155a4.642 4.642 0 001.89-4.755 4.567 4.567 0 00-3.745-3.62 4.648 4.648 0 00-5.442 4.574c0 1.571.787 2.96 1.986 3.8-1.258.235-2.407.63-3.323 1.167-.536.314-.953.674-1.256 1.076A8.617 8.617 0 013.326 12c0-5.821 5.765-10.322 11.885-8.093m.112-1.368A10.052 10.052 0 002.539 15.321a9.611 9.611 0 006.138 6.14A10.052 10.052 0 0021.461 8.679a9.611 9.611 0 00-6.138-6.14"></path></svg>

  </button>
    <button class="user-account-nav__text-button user-account-nav__text-button--unauth userAccountButton" aria-haspopup="true" aria-expanded="false" role="link" aria-label="User Account Log In Button" data-login-href="/account/log-in" data-zjs="click" data-zjs-component_id="/account/log-in" data-zjs-component_text="User Account Log In Button" data-zjs-component_type="button" data-zjs-container_id="" data-zjs-container_type="navigation" data-zjs-destination_url="/account/log-in" data-zjs-page_type="article" data-zjs-page_variant="article_leaf" data-zjs-navigation-type="sub" data-zjs-navigation-location="footer">
      Log In
    </button>
</div>
<div class="user-account-nav__menu userAccountNavMenu" aria-label="User Account Nav Menu">
  <div class="user-account-nav__menu-button userAccountNavMenuButton" aria-haspopup="true" aria-expanded="false" data-zjs="click" data-zjs-component_id="user-account-nav__menu-button userAccountNavMenuButton" data-zjs-component_text="My Account" data-zjs-component_type="button" data-zjs-container_id="" data-zjs-container_type="navigation" data-zjs-destination_url="" data-zjs-page_type="article" data-zjs-page_variant="article_leaf" data-zjs-navigation-type="sub" data-zjs-navigation-location="footer">
    My Account<span aria-hidden="true"><svg class="icon-ui-caret-down" width="24" height="24" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="M12.478 17.218a.637.637 0 01-.946 0L2.206 7.2c-.225-.242-.28-.632-.093-.91a.613.613 0 01.975-.088l8.917 9.579 8.878-9.538c.225-.242.589-.3.847-.1.33.255.357.752.082 1.048l-9.334 10.027z"></path></svg>
</span>
  </div>
  <ul class="user-account-nav__menu-options userAccountNavOptions" role="menu" tabindex="0">
    <li class="user-account-nav__menu-item">
     <a class="user-account-nav__menu-link" data-name="settings" href="/account/settings" data-zjs="click" data-zjs-component_id="cms.cnn.com/_components/user-account-nav/instances/user-account-nav@published" data-zjs-component_text="Settings" data-zjs-component_type="link" data-zjs-container_id="" data-zjs-container_type="navigation" data-zjs-destination_url="/account/settings" data-zjs-page_type="article" data-zjs-page_variant="article_leaf" data-zjs-navigation-type="sub" data-zjs-navigation-location="footer">
        Settings
      </a>
    </li>
    <li class="user-account-nav__menu-item">
     <a class="user-account-nav__menu-link user-account-nav__menu-link--hide" data-name="follow" href="/account/my-news?iid=fw_var-nav" data-zjs="click" data-zjs-component_id="cms.cnn.com/_components/user-account-nav/instances/user-account-nav@published" data-zjs-component_text="Topics You Follow" data-zjs-component_type="link" data-zjs-container_id="" data-zjs-container_type="navigation" data-zjs-destination_url="/account/my-news?iid=fw_var-nav" data-zjs-page_type="article" data-zjs-page_variant="article_leaf" data-zjs-navigation-type="sub" data-zjs-navigation-location="footer">
        Topics You Follow
        <span class="user-account-nav__menu-notification-dot"></span>
      </a>
    </li>
    <li class="user-account-nav__menu-item">
     <a class="user-account-nav__menu-link" data-name="logout" href="#" data-zjs="click" data-zjs-component_id="cms.cnn.com/_components/user-account-nav/instances/user-account-nav@published" data-zjs-component_text="Log Out" data-zjs-component_type="link" data-zjs-container_id="" data-zjs-container_type="navigation" data-zjs-destination_url="#" data-zjs-page_type="article" data-zjs-page_variant="article_leaf" data-zjs-navigation-type="sub" data-zjs-navigation-location="footer">
        Log Out
      </a>
    </li>
  </ul>
</div>
<div class="user-account-nav__user">
  <span class="user-account-nav__user__text user-account-nav__user__text--auth">Your CNN account</span>
  <span class="user-account-nav__user__text user-account-nav__user__text--unauth">Log in to your CNN account</span>
</div>
<a class="user-account-nav__override-link" href="/account/log-in" data-zjs="click" data-zjs-component_id="user-account-nav__override-link" data-zjs-component_text="" data-zjs-component_type="link" data-zjs-container_id="" data-zjs-container_type="navigation" data-zjs-destination_url="#" data-zjs-page_type="article" data-zjs-page_variant="article_leaf" data-zjs-navigation-type="sub" data-zjs-navigation-location="footer"></a>
</nav>

    </div>
    <hr class="footer__divider footer__live-tv-link-mobile">
    <a class="footer__live-tv-link footer__live-tv-link-mobile" aria-label="Live TV" href="https://edition.cnn.com/live-tv" data-zjs="click" data-zjs-component_id="https://edition.cnn.com/live-tv" data-zjs-component_text="Live TV" data-zjs-component_type="link" data-zjs-container_id="cms.cnn.com/_components/footer/instances/business-v2@published" data-zjs-container_type="navigation" data-zjs-destination_url="https://edition.cnn.com/live-tv" data-zjs-page_type="article" data-zjs-page_variant="article_leaf" data-zjs-navigation-type="main" data-zjs-navigation-location="footer">
      Live TV
    </a>
    <a class="footer__audio-link footer__audio-link-mobile" aria-label="Audio" href="https://edition.cnn.com/audio" data-zjs="click" data-zjs-component_id="https://edition.cnn.com/audio" data-zjs-component_text="Audio" data-zjs-component_type="link" data-zjs-container_id="cms.cnn.com/_components/footer/instances/business-v2@published" data-zjs-container_type="navigation" data-zjs-destination_url="https://edition.cnn.com/audio" data-zjs-page_type="article" data-zjs-page_variant="article_leaf" data-zjs-navigation-type="main" data-zjs-navigation-location="footer">
      Audio
    </a>
    <hr class="footer__divider footer__divider-mobile">
    <div class="footer__subnav">
        <nav class="subnav" data-uri="cms.cnn.com/_components/subnav/instances/new-edition-footer-v1@published" data-editable="settings">
<ul class="subnav__sections">
  <li class="subnav__section">
    <a href="https://edition.cnn.com/world" class="subnav__section-link" data-zjs="click" data-zjs-component_id="https://edition.cnn.com/world" data-zjs-component_text="World" data-zjs-component_type="link" data-zjs-container_id="" data-zjs-container_type="navigation" data-zjs-destination_url="https://edition.cnn.com/world" data-zjs-page_type="article" data-zjs-page_variant="article_leaf" data-zjs-navigation-type="sub" data-zjs-navigation-location="footer">
      World
    </a>
    <ul class="subnav__subsections">
      <li class="subnav__subsection">
        <a href="https://edition.cnn.com/world/africa" aria-label="World Africa" class="subnav__subsection-link" data-zjs="click" data-zjs-component_id="https://edition.cnn.com/world/africa" data-zjs-component_text="Africa" data-zjs-component_type="link" data-zjs-container_id="" data-zjs-container_type="navigation" data-zjs-destination_url="https://edition.cnn.com/world/africa" data-zjs-page_type="article" data-zjs-page_variant="article_leaf" data-zjs-navigation-type="sub" data-zjs-navigation-location="footer">
          Africa
        </a>
      </li>
      <li class="subnav__subsection">
        <a href="https://edition.cnn.com/world/americas" aria-label="World Americas" class="subnav__subsection-link" data-zjs="click" data-zjs-component_id="https://edition.cnn.com/world/americas" data-zjs-component_text="Americas" data-zjs-component_type="link" data-zjs-container_id="" data-zjs-container_type="navigation" data-zjs-destination_url="https://edition.cnn.com/world/americas" data-zjs-page_type="article" data-zjs-page_variant="article_leaf" data-zjs-navigation-type="sub" data-zjs-navigation-location="footer">
          Americas
        </a>
      </li>
      <li class="subnav__subsection">
        <a href="https://edition.cnn.com/world/asia" aria-label="World Asia" class="subnav__subsection-link" data-zjs="click" data-zjs-component_id="https://edition.cnn.com/world/asia" data-zjs-component_text="Asia" data-zjs-component_type="link" data-zjs-container_id="" data-zjs-container_type="navigation" data-zjs-destination_url="https://edition.cnn.com/world/asia" data-zjs-page_type="article" data-zjs-page_variant="article_leaf" data-zjs-navigation-type="sub" data-zjs-navigation-location="footer">
          Asia
        </a>
      </li>
      <li class="subnav__subsection">
        <a href="https://edition.cnn.com/world/australia" aria-label="World Australia" class="subnav__subsection-link" data-zjs="click" data-zjs-component_id="https://edition.cnn.com/world/australia" data-zjs-component_text="Australia" data-zjs-component_type="link" data-zjs-container_id="" data-zjs-container_type="navigation" data-zjs-destination_url="https://edition.cnn.com/world/australia" data-zjs-page_type="article" data-zjs-page_variant="article_leaf" data-zjs-navigation-type="sub" data-zjs-navigation-location="footer">
          Australia
        </a>
      </li>
      <li class="subnav__subsection">
        <a href="https://edition.cnn.com/world/china" aria-label="World China" class="subnav__subsection-link" data-zjs="click" data-zjs-component_id="https://edition.cnn.com/world/china" data-zjs-component_text="China" data-zjs-component_type="link" data-zjs-container_id="" data-zjs-container_type="navigation" data-zjs-destination_url="https://edition.cnn.com/world/china" data-zjs-page_type="article" data-zjs-page_variant="article_leaf" data-zjs-navigation-type="sub" data-zjs-navigation-location="footer">
          China
        </a>
      </li>
      <li class="subnav__subsection">
        <a href="https://edition.cnn.com/world/europe" aria-label="World Europe" class="subnav__subsection-link" data-zjs="click" data-zjs-component_id="https://edition.cnn.com/world/europe" data-zjs-component_text="Europe" data-zjs-component_type="link" data-zjs-container_id="" data-zjs-container_type="navigation" data-zjs-destination_url="https://edition.cnn.com/world/europe" data-zjs-page_type="article" data-zjs-page_variant="article_leaf" data-zjs-navigation-type="sub" data-zjs-navigation-location="footer">
          Europe
        </a>
      </li>
      <li class="subnav__subsection">
        <a href="https://edition.cnn.com/world/india" aria-label="World India" class="subnav__subsection-link" data-zjs="click" data-zjs-component_id="https://edition.cnn.com/world/india" data-zjs-component_text="India" data-zjs-component_type="link" data-zjs-container_id="" data-zjs-container_type="navigation" data-zjs-destination_url="https://edition.cnn.com/world/india" data-zjs-page_type="article" data-zjs-page_variant="article_leaf" data-zjs-navigation-type="sub" data-zjs-navigation-location="footer">
          India
        </a>
      </li>
      <li class="subnav__subsection">
        <a href="https://edition.cnn.com/world/middle-east" aria-label="World Middle East" class="subnav__subsection-link" data-zjs="click" data-zjs-component_id="https://edition.cnn.com/world/middle-east" data-zjs-component_text="Middle East" data-zjs-component_type="link" data-zjs-container_id="" data-zjs-container_type="navigation" data-zjs-destination_url="https://edition.cnn.com/world/middle-east" data-zjs-page_type="article" data-zjs-page_variant="article_leaf" data-zjs-navigation-type="sub" data-zjs-navigation-location="footer">
          Middle East
        </a>
      </li>
      <li class="subnav__subsection">
        <a href="https://edition.cnn.com/world/united-kingdom" aria-label="World United Kingdom" class="subnav__subsection-link" data-zjs="click" data-zjs-component_id="https://edition.cnn.com/world/united-kingdom" data-zjs-component_text="United Kingdom" data-zjs-component_type="link" data-zjs-container_id="" data-zjs-container_type="navigation" data-zjs-destination_url="https://edition.cnn.com/world/united-kingdom" data-zjs-page_type="article" data-zjs-page_variant="article_leaf" data-zjs-navigation-type="sub" data-zjs-navigation-location="footer">
          United Kingdom
        </a>
      </li>
    </ul>
  </li>
  <li class="subnav__section">
    <a href="https://edition.cnn.com/politics" class="subnav__section-link" data-zjs="click" data-zjs-component_id="https://edition.cnn.com/politics" data-zjs-component_text="US Politics" data-zjs-component_type="link" data-zjs-container_id="" data-zjs-container_type="navigation" data-zjs-destination_url="https://edition.cnn.com/politics" data-zjs-page_type="article" data-zjs-page_variant="article_leaf" data-zjs-navigation-type="sub" data-zjs-navigation-location="footer">
      US Politics
    </a>
    <ul class="subnav__subsections">
      <li class="subnav__subsection">
        <a href="https://edition.cnn.com/specials/politics/joe-biden-news" aria-label="US Politics The Biden Presidency" class="subnav__subsection-link" data-zjs="click" data-zjs-component_id="https://edition.cnn.com/specials/politics/joe-biden-news" data-zjs-component_text="The Biden Presidency" data-zjs-component_type="link" data-zjs-container_id="" data-zjs-container_type="navigation" data-zjs-destination_url="https://edition.cnn.com/specials/politics/joe-biden-news" data-zjs-page_type="article" data-zjs-page_variant="article_leaf" data-zjs-navigation-type="sub" data-zjs-navigation-location="footer">
          The Biden Presidency
        </a>
      </li>
      <li class="subnav__subsection">
        <a href="https://edition.cnn.com/specials/politics/fact-check-politics" aria-label="US Politics Facts First" class="subnav__subsection-link" data-zjs="click" data-zjs-component_id="https://edition.cnn.com/specials/politics/fact-check-politics" data-zjs-component_text="Facts First" data-zjs-component_type="link" data-zjs-container_id="" data-zjs-container_type="navigation" data-zjs-destination_url="https://edition.cnn.com/specials/politics/fact-check-politics" data-zjs-page_type="article" data-zjs-page_variant="article_leaf" data-zjs-navigation-type="sub" data-zjs-navigation-location="footer">
          Facts First
        </a>
      </li>
      <li class="subnav__subsection">
        <a href="https://edition.cnn.com/election/2020/results/president" aria-label="US Politics US Elections" class="subnav__subsection-link" data-zjs="click" data-zjs-component_id="https://edition.cnn.com/election/2020/results/president" data-zjs-component_text="US Elections" data-zjs-component_type="link" data-zjs-container_id="" data-zjs-container_type="navigation" data-zjs-destination_url="https://edition.cnn.com/election/2020/results/president" data-zjs-page_type="article" data-zjs-page_variant="article_leaf" data-zjs-navigation-type="sub" data-zjs-navigation-location="footer">
          US Elections
        </a>
      </li>
    </ul>
  </li>
  <li class="subnav__section">
    <a href="https://edition.cnn.com/business" class="subnav__section-link" data-zjs="click" data-zjs-component_id="https://edition.cnn.com/business" data-zjs-component_text="Business" data-zjs-component_type="link" data-zjs-container_id="" data-zjs-container_type="navigation" data-zjs-destination_url="https://edition.cnn.com/business" data-zjs-page_type="article" data-zjs-page_variant="article_leaf" data-zjs-navigation-type="sub" data-zjs-navigation-location="footer">
      Business
    </a>
    <ul class="subnav__subsections">
      <li class="subnav__subsection">
        <a href="https://edition.cnn.com/markets" aria-label="Business Markets" class="subnav__subsection-link" data-zjs="click" data-zjs-component_id="https://edition.cnn.com/markets" data-zjs-component_text="Markets" data-zjs-component_type="link" data-zjs-container_id="" data-zjs-container_type="navigation" data-zjs-destination_url="https://edition.cnn.com/markets" data-zjs-page_type="article" data-zjs-page_variant="article_leaf" data-zjs-navigation-type="sub" data-zjs-navigation-location="footer">
          Markets
        </a>
      </li>
      <li class="subnav__subsection">
        <a href="https://edition.cnn.com/business/tech" aria-label="Business Tech" class="subnav__subsection-link" data-zjs="click" data-zjs-component_id="https://edition.cnn.com/business/tech" data-zjs-component_text="Tech" data-zjs-component_type="link" data-zjs-container_id="" data-zjs-container_type="navigation" data-zjs-destination_url="https://edition.cnn.com/business/tech" data-zjs-page_type="article" data-zjs-page_variant="article_leaf" data-zjs-navigation-type="sub" data-zjs-navigation-location="footer">
          Tech
        </a>
      </li>
      <li class="subnav__subsection">
        <a href="https://edition.cnn.com/business/media" aria-label="Business Media" class="subnav__subsection-link" data-zjs="click" data-zjs-component_id="https://edition.cnn.com/business/media" data-zjs-component_text="Media" data-zjs-component_type="link" data-zjs-container_id="" data-zjs-container_type="navigation" data-zjs-destination_url="https://edition.cnn.com/business/media" data-zjs-page_type="article" data-zjs-page_variant="article_leaf" data-zjs-navigation-type="sub" data-zjs-navigation-location="footer">
          Media
        </a>
      </li>
      <li class="subnav__subsection">
        <a href="https://edition.cnn.com/business/financial-calculators" aria-label="Business Calculators" class="subnav__subsection-link" data-zjs="click" data-zjs-component_id="https://edition.cnn.com/business/financial-calculators" data-zjs-component_text="Calculators" data-zjs-component_type="link" data-zjs-container_id="" data-zjs-container_type="navigation" data-zjs-destination_url="https://edition.cnn.com/business/financial-calculators" data-zjs-page_type="article" data-zjs-page_variant="article_leaf" data-zjs-navigation-type="sub" data-zjs-navigation-location="footer">
          Calculators
        </a>
      </li>
      <li class="subnav__subsection">
        <a href="https://edition.cnn.com/business/videos" aria-label="Business Videos" class="subnav__subsection-link" data-zjs="click" data-zjs-component_id="https://edition.cnn.com/business/videos" data-zjs-component_text="Videos" data-zjs-component_type="link" data-zjs-container_id="" data-zjs-container_type="navigation" data-zjs-destination_url="https://edition.cnn.com/business/videos" data-zjs-page_type="article" data-zjs-page_variant="article_leaf" data-zjs-navigation-type="sub" data-zjs-navigation-location="footer">
          Videos
        </a>
      </li>
    </ul>
  </li>
  <li class="subnav__section">
    <a href="https://edition.cnn.com/health" class="subnav__section-link" data-zjs="click" data-zjs-component_id="https://edition.cnn.com/health" data-zjs-component_text="Health" data-zjs-component_type="link" data-zjs-container_id="" data-zjs-container_type="navigation" data-zjs-destination_url="https://edition.cnn.com/health" data-zjs-page_type="article" data-zjs-page_variant="article_leaf" data-zjs-navigation-type="sub" data-zjs-navigation-location="footer">
      Health
    </a>
    <ul class="subnav__subsections">
      <li class="subnav__subsection">
        <a href="https://edition.cnn.com/interactive/life-but-better/" aria-label="Health Life, But Better" class="subnav__subsection-link" data-zjs="click" data-zjs-component_id="https://edition.cnn.com/interactive/life-but-better/" data-zjs-component_text="Life, But Better" data-zjs-component_type="link" data-zjs-container_id="" data-zjs-container_type="navigation" data-zjs-destination_url="https://edition.cnn.com/interactive/life-but-better/" data-zjs-page_type="article" data-zjs-page_variant="article_leaf" data-zjs-navigation-type="sub" data-zjs-navigation-location="footer">
          Life, But Better
        </a>
      </li>
      <li class="subnav__subsection">
        <a href="https://edition.cnn.com/specials/health/fitness-life-but-better" aria-label="Health Fitness" class="subnav__subsection-link" data-zjs="click" data-zjs-component_id="https://edition.cnn.com/specials/health/fitness-life-but-better" data-zjs-component_text="Fitness" data-zjs-component_type="link" data-zjs-container_id="" data-zjs-container_type="navigation" data-zjs-destination_url="https://edition.cnn.com/specials/health/fitness-life-but-better" data-zjs-page_type="article" data-zjs-page_variant="article_leaf" data-zjs-navigation-type="sub" data-zjs-navigation-location="footer">
          Fitness
        </a>
      </li>
      <li class="subnav__subsection">
        <a href="https://edition.cnn.com/specials/health/food-life-but-better" aria-label="Health Food" class="subnav__subsection-link" data-zjs="click" data-zjs-component_id="https://edition.cnn.com/specials/health/food-life-but-better" data-zjs-component_text="Food" data-zjs-component_type="link" data-zjs-container_id="" data-zjs-container_type="navigation" data-zjs-destination_url="https://edition.cnn.com/specials/health/food-life-but-better" data-zjs-page_type="article" data-zjs-page_variant="article_leaf" data-zjs-navigation-type="sub" data-zjs-navigation-location="footer">
          Food
        </a>
      </li>
      <li class="subnav__subsection">
        <a href="https://edition.cnn.com/specials/health/sleep-life-but-better" aria-label="Health Sleep" class="subnav__subsection-link" data-zjs="click" data-zjs-component_id="https://edition.cnn.com/specials/health/sleep-life-but-better" data-zjs-component_text="Sleep" data-zjs-component_type="link" data-zjs-container_id="" data-zjs-container_type="navigation" data-zjs-destination_url="https://edition.cnn.com/specials/health/sleep-life-but-better" data-zjs-page_type="article" data-zjs-page_variant="article_leaf" data-zjs-navigation-type="sub" data-zjs-navigation-location="footer">
          Sleep
        </a>
      </li>
      <li class="subnav__subsection">
        <a href="https://edition.cnn.com/specials/health/mindfulness-life-but-better" aria-label="Health Mindfulness" class="subnav__subsection-link" data-zjs="click" data-zjs-component_id="https://edition.cnn.com/specials/health/mindfulness-life-but-better" data-zjs-component_text="Mindfulness" data-zjs-component_type="link" data-zjs-container_id="" data-zjs-container_type="navigation" data-zjs-destination_url="https://edition.cnn.com/specials/health/mindfulness-life-but-better" data-zjs-page_type="article" data-zjs-page_variant="article_leaf" data-zjs-navigation-type="sub" data-zjs-navigation-location="footer">
          Mindfulness
        </a>
      </li>
      <li class="subnav__subsection">
        <a href="https://edition.cnn.com/specials/health/relationships-life-but-better" aria-label="Health Relationships" class="subnav__subsection-link" data-zjs="click" data-zjs-component_id="https://edition.cnn.com/specials/health/relationships-life-but-better" data-zjs-component_text="Relationships" data-zjs-component_type="link" data-zjs-container_id="" data-zjs-container_type="navigation" data-zjs-destination_url="https://edition.cnn.com/specials/health/relationships-life-but-better" data-zjs-page_type="article" data-zjs-page_variant="article_leaf" data-zjs-navigation-type="sub" data-zjs-navigation-location="footer">
          Relationships
        </a>
      </li>
    </ul>
  </li>
  <li class="subnav__section">
    <a href="https://edition.cnn.com/entertainment" class="subnav__section-link" data-zjs="click" data-zjs-component_id="https://edition.cnn.com/entertainment" data-zjs-component_text="Entertainment" data-zjs-component_type="link" data-zjs-container_id="" data-zjs-container_type="navigation" data-zjs-destination_url="https://edition.cnn.com/entertainment" data-zjs-page_type="article" data-zjs-page_variant="article_leaf" data-zjs-navigation-type="sub" data-zjs-navigation-location="footer">
      Entertainment
    </a>
    <ul class="subnav__subsections">
      <li class="subnav__subsection">
        <a href="https://edition.cnn.com/entertainment/movies" aria-label="Entertainment Movies" class="subnav__subsection-link" data-zjs="click" data-zjs-component_id="https://edition.cnn.com/entertainment/movies" data-zjs-component_text="Movies" data-zjs-component_type="link" data-zjs-container_id="" data-zjs-container_type="navigation" data-zjs-destination_url="https://edition.cnn.com/entertainment/movies" data-zjs-page_type="article" data-zjs-page_variant="article_leaf" data-zjs-navigation-type="sub" data-zjs-navigation-location="footer">
          Movies
        </a>
      </li>
      <li class="subnav__subsection">
        <a href="https://edition.cnn.com/entertainment/tv-shows" aria-label="Entertainment Television" class="subnav__subsection-link" data-zjs="click" data-zjs-component_id="https://edition.cnn.com/entertainment/tv-shows" data-zjs-component_text="Television" data-zjs-component_type="link" data-zjs-container_id="" data-zjs-container_type="navigation" data-zjs-destination_url="https://edition.cnn.com/entertainment/tv-shows" data-zjs-page_type="article" data-zjs-page_variant="article_leaf" data-zjs-navigation-type="sub" data-zjs-navigation-location="footer">
          Television
        </a>
      </li>
      <li class="subnav__subsection">
        <a href="https://edition.cnn.com/entertainment/celebrities" aria-label="Entertainment Celebrity" class="subnav__subsection-link" data-zjs="click" data-zjs-component_id="https://edition.cnn.com/entertainment/celebrities" data-zjs-component_text="Celebrity" data-zjs-component_type="link" data-zjs-container_id="" data-zjs-container_type="navigation" data-zjs-destination_url="https://edition.cnn.com/entertainment/celebrities" data-zjs-page_type="article" data-zjs-page_variant="article_leaf" data-zjs-navigation-type="sub" data-zjs-navigation-location="footer">
          Celebrity
        </a>
      </li>
    </ul>
  </li>
  <li class="subnav__section">
    <a href="https://edition.cnn.com/business/tech" class="subnav__section-link" data-zjs="click" data-zjs-component_id="https://edition.cnn.com/business/tech" data-zjs-component_text="Tech" data-zjs-component_type="link" data-zjs-container_id="" data-zjs-container_type="navigation" data-zjs-destination_url="https://edition.cnn.com/business/tech" data-zjs-page_type="article" data-zjs-page_variant="article_leaf" data-zjs-navigation-type="sub" data-zjs-navigation-location="footer">
      Tech
    </a>
    <ul class="subnav__subsections">
      <li class="subnav__subsection">
        <a href="https://edition.cnn.com/specials/tech/innovate" aria-label="Tech Innovate" class="subnav__subsection-link" data-zjs="click" data-zjs-component_id="https://edition.cnn.com/specials/tech/innovate" data-zjs-component_text="Innovate" data-zjs-component_type="link" data-zjs-container_id="" data-zjs-container_type="navigation" data-zjs-destination_url="https://edition.cnn.com/specials/tech/innovate" data-zjs-page_type="article" data-zjs-page_variant="article_leaf" data-zjs-navigation-type="sub" data-zjs-navigation-location="footer">
          Innovate
        </a>
      </li>
      <li class="subnav__subsection">
        <a href="https://edition.cnn.com/specials/tech/gadget" aria-label="Tech Gadget" class="subnav__subsection-link" data-zjs="click" data-zjs-component_id="https://edition.cnn.com/specials/tech/gadget" data-zjs-component_text="Gadget" data-zjs-component_type="link" data-zjs-container_id="" data-zjs-container_type="navigation" data-zjs-destination_url="https://edition.cnn.com/specials/tech/gadget" data-zjs-page_type="article" data-zjs-page_variant="article_leaf" data-zjs-navigation-type="sub" data-zjs-navigation-location="footer">
          Gadget
        </a>
      </li>
      <li class="subnav__subsection">
        <a href="https://edition.cnn.com/specials/tech/foreseeable-future" aria-label="Tech Foreseeable Future" class="subnav__subsection-link" data-zjs="click" data-zjs-component_id="https://edition.cnn.com/specials/tech/foreseeable-future" data-zjs-component_text="Foreseeable Future" data-zjs-component_type="link" data-zjs-container_id="" data-zjs-container_type="navigation" data-zjs-destination_url="https://edition.cnn.com/specials/tech/foreseeable-future" data-zjs-page_type="article" data-zjs-page_variant="article_leaf" data-zjs-navigation-type="sub" data-zjs-navigation-location="footer">
          Foreseeable Future
        </a>
      </li>
      <li class="subnav__subsection">
        <a href="https://edition.cnn.com/specials/tech/mission-ahead" aria-label="Tech Mission: Ahead" class="subnav__subsection-link" data-zjs="click" data-zjs-component_id="https://edition.cnn.com/specials/tech/mission-ahead" data-zjs-component_text="Mission: Ahead" data-zjs-component_type="link" data-zjs-container_id="" data-zjs-container_type="navigation" data-zjs-destination_url="https://edition.cnn.com/specials/tech/mission-ahead" data-zjs-page_type="article" data-zjs-page_variant="article_leaf" data-zjs-navigation-type="sub" data-zjs-navigation-location="footer">
          Mission: Ahead
        </a>
      </li>
      <li class="subnav__subsection">
        <a href="https://edition.cnn.com/specials/tech/upstarts" aria-label="Tech Upstarts" class="subnav__subsection-link" data-zjs="click" data-zjs-component_id="https://edition.cnn.com/specials/tech/upstarts" data-zjs-component_text="Upstarts" data-zjs-component_type="link" data-zjs-container_id="" data-zjs-container_type="navigation" data-zjs-destination_url="https://edition.cnn.com/specials/tech/upstarts" data-zjs-page_type="article" data-zjs-page_variant="article_leaf" data-zjs-navigation-type="sub" data-zjs-navigation-location="footer">
          Upstarts
        </a>
      </li>
      <li class="subnav__subsection">
        <a href="https://edition.cnn.com/specials/tech/work-transformed" aria-label="Tech Work Transformed" class="subnav__subsection-link" data-zjs="click" data-zjs-component_id="https://edition.cnn.com/specials/tech/work-transformed" data-zjs-component_text="Work Transformed" data-zjs-component_type="link" data-zjs-container_id="" data-zjs-container_type="navigation" data-zjs-destination_url="https://edition.cnn.com/specials/tech/work-transformed" data-zjs-page_type="article" data-zjs-page_variant="article_leaf" data-zjs-navigation-type="sub" data-zjs-navigation-location="footer">
          Work Transformed
        </a>
      </li>
      <li class="subnav__subsection">
        <a href="https://edition.cnn.com/specials/tech/innovative-cities" aria-label="Tech Innovative Cities" class="subnav__subsection-link" data-zjs="click" data-zjs-component_id="https://edition.cnn.com/specials/tech/innovative-cities" data-zjs-component_text="Innovative Cities" data-zjs-component_type="link" data-zjs-container_id="" data-zjs-container_type="navigation" data-zjs-destination_url="https://edition.cnn.com/specials/tech/innovative-cities" data-zjs-page_type="article" data-zjs-page_variant="article_leaf" data-zjs-navigation-type="sub" data-zjs-navigation-location="footer">
          Innovative Cities
        </a>
      </li>
    </ul>
  </li>
  <li class="subnav__section">
    <a href="https://edition.cnn.com/style" class="subnav__section-link" data-zjs="click" data-zjs-component_id="https://edition.cnn.com/style" data-zjs-component_text="Style" data-zjs-component_type="link" data-zjs-container_id="" data-zjs-container_type="navigation" data-zjs-destination_url="https://edition.cnn.com/style" data-zjs-page_type="article" data-zjs-page_variant="article_leaf" data-zjs-navigation-type="sub" data-zjs-navigation-location="footer">
      Style
    </a>
    <ul class="subnav__subsections">
      <li class="subnav__subsection">
        <a href="https://edition.cnn.com/style/arts" aria-label="Style Arts" class="subnav__subsection-link" data-zjs="click" data-zjs-component_id="https://edition.cnn.com/style/arts" data-zjs-component_text="Arts" data-zjs-component_type="link" data-zjs-container_id="" data-zjs-container_type="navigation" data-zjs-destination_url="https://edition.cnn.com/style/arts" data-zjs-page_type="article" data-zjs-page_variant="article_leaf" data-zjs-navigation-type="sub" data-zjs-navigation-location="footer">
          Arts
        </a>
      </li>
      <li class="subnav__subsection">
        <a href="https://edition.cnn.com/style/design" aria-label="Style Design" class="subnav__subsection-link" data-zjs="click" data-zjs-component_id="https://edition.cnn.com/style/design" data-zjs-component_text="Design" data-zjs-component_type="link" data-zjs-container_id="" data-zjs-container_type="navigation" data-zjs-destination_url="https://edition.cnn.com/style/design" data-zjs-page_type="article" data-zjs-page_variant="article_leaf" data-zjs-navigation-type="sub" data-zjs-navigation-location="footer">
          Design
        </a>
      </li>
      <li class="subnav__subsection">
        <a href="https://edition.cnn.com/style/fashion" aria-label="Style Fashion" class="subnav__subsection-link" data-zjs="click" data-zjs-component_id="https://edition.cnn.com/style/fashion" data-zjs-component_text="Fashion" data-zjs-component_type="link" data-zjs-container_id="" data-zjs-container_type="navigation" data-zjs-destination_url="https://edition.cnn.com/style/fashion" data-zjs-page_type="article" data-zjs-page_variant="article_leaf" data-zjs-navigation-type="sub" data-zjs-navigation-location="footer">
          Fashion
        </a>
      </li>
      <li class="subnav__subsection">
        <a href="https://edition.cnn.com/style/architecture" aria-label="Style Architecture" class="subnav__subsection-link" data-zjs="click" data-zjs-component_id="https://edition.cnn.com/style/architecture" data-zjs-component_text="Architecture" data-zjs-component_type="link" data-zjs-container_id="" data-zjs-container_type="navigation" data-zjs-destination_url="https://edition.cnn.com/style/architecture" data-zjs-page_type="article" data-zjs-page_variant="article_leaf" data-zjs-navigation-type="sub" data-zjs-navigation-location="footer">
          Architecture
        </a>
      </li>
      <li class="subnav__subsection">
        <a href="https://edition.cnn.com/style/luxury" aria-label="Style Luxury" class="subnav__subsection-link" data-zjs="click" data-zjs-component_id="https://edition.cnn.com/style/luxury" data-zjs-component_text="Luxury" data-zjs-component_type="link" data-zjs-container_id="" data-zjs-container_type="navigation" data-zjs-destination_url="https://edition.cnn.com/style/luxury" data-zjs-page_type="article" data-zjs-page_variant="article_leaf" data-zjs-navigation-type="sub" data-zjs-navigation-location="footer">
          Luxury
        </a>
      </li>
      <li class="subnav__subsection">
        <a href="https://edition.cnn.com/style/beauty" aria-label="Style Beauty" class="subnav__subsection-link" data-zjs="click" data-zjs-component_id="https://edition.cnn.com/style/beauty" data-zjs-component_text="Beauty" data-zjs-component_type="link" data-zjs-container_id="" data-zjs-container_type="navigation" data-zjs-destination_url="https://edition.cnn.com/style/beauty" data-zjs-page_type="article" data-zjs-page_variant="article_leaf" data-zjs-navigation-type="sub" data-zjs-navigation-location="footer">
          Beauty
        </a>
      </li>
      <li class="subnav__subsection">
        <a href="https://edition.cnn.com/style/videos" aria-label="Style Video" class="subnav__subsection-link" data-zjs="click" data-zjs-component_id="https://edition.cnn.com/style/videos" data-zjs-component_text="Video" data-zjs-component_type="link" data-zjs-container_id="" data-zjs-container_type="navigation" data-zjs-destination_url="https://edition.cnn.com/style/videos" data-zjs-page_type="article" data-zjs-page_variant="article_leaf" data-zjs-navigation-type="sub" data-zjs-navigation-location="footer">
          Video
        </a>
      </li>
    </ul>
  </li>
  <li class="subnav__section">
    <a href="https://edition.cnn.com/travel" class="subnav__section-link" data-zjs="click" data-zjs-component_id="https://edition.cnn.com/travel" data-zjs-component_text="Travel" data-zjs-component_type="link" data-zjs-container_id="" data-zjs-container_type="navigation" data-zjs-destination_url="https://edition.cnn.com/travel" data-zjs-page_type="article" data-zjs-page_variant="article_leaf" data-zjs-navigation-type="sub" data-zjs-navigation-location="footer">
      Travel
    </a>
    <ul class="subnav__subsections">
      <li class="subnav__subsection">
        <a href="https://edition.cnn.com/travel/destinations" aria-label="Travel Destinations" class="subnav__subsection-link" data-zjs="click" data-zjs-component_id="https://edition.cnn.com/travel/destinations" data-zjs-component_text="Destinations" data-zjs-component_type="link" data-zjs-container_id="" data-zjs-container_type="navigation" data-zjs-destination_url="https://edition.cnn.com/travel/destinations" data-zjs-page_type="article" data-zjs-page_variant="article_leaf" data-zjs-navigation-type="sub" data-zjs-navigation-location="footer">
          Destinations
        </a>
      </li>
      <li class="subnav__subsection">
        <a href="https://edition.cnn.com/travel/food-and-drink" aria-label="Travel Food &amp; Drink" class="subnav__subsection-link" data-zjs="click" data-zjs-component_id="https://edition.cnn.com/travel/food-and-drink" data-zjs-component_text="Food &amp; Drink" data-zjs-component_type="link" data-zjs-container_id="" data-zjs-container_type="navigation" data-zjs-destination_url="https://edition.cnn.com/travel/food-and-drink" data-zjs-page_type="article" data-zjs-page_variant="article_leaf" data-zjs-navigation-type="sub" data-zjs-navigation-location="footer">
          Food &amp; Drink
        </a>
      </li>
      <li class="subnav__subsection">
        <a href="https://edition.cnn.com/travel/stay" aria-label="Travel Stay" class="subnav__subsection-link" data-zjs="click" data-zjs-component_id="https://edition.cnn.com/travel/stay" data-zjs-component_text="Stay" data-zjs-component_type="link" data-zjs-container_id="" data-zjs-container_type="navigation" data-zjs-destination_url="https://edition.cnn.com/travel/stay" data-zjs-page_type="article" data-zjs-page_variant="article_leaf" data-zjs-navigation-type="sub" data-zjs-navigation-location="footer">
          Stay
        </a>
      </li>
      <li class="subnav__subsection">
        <a href="https://edition.cnn.com/travel/news" aria-label="Travel News" class="subnav__subsection-link" data-zjs="click" data-zjs-component_id="https://edition.cnn.com/travel/news" data-zjs-component_text="News" data-zjs-component_type="link" data-zjs-container_id="" data-zjs-container_type="navigation" data-zjs-destination_url="https://edition.cnn.com/travel/news" data-zjs-page_type="article" data-zjs-page_variant="article_leaf" data-zjs-navigation-type="sub" data-zjs-navigation-location="footer">
          News
        </a>
      </li>
      <li class="subnav__subsection">
        <a href="https://edition.cnn.com/travel/videos" aria-label="Travel Videos" class="subnav__subsection-link" data-zjs="click" data-zjs-component_id="https://edition.cnn.com/travel/videos" data-zjs-component_text="Videos" data-zjs-component_type="link" data-zjs-container_id="" data-zjs-container_type="navigation" data-zjs-destination_url="https://edition.cnn.com/travel/videos" data-zjs-page_type="article" data-zjs-page_variant="article_leaf" data-zjs-navigation-type="sub" data-zjs-navigation-location="footer">
          Videos
        </a>
      </li>
    </ul>
  </li>
  <li class="subnav__section">
    <a href="https://edition.cnn.com/sport" class="subnav__section-link" data-zjs="click" data-zjs-component_id="https://edition.cnn.com/sport" data-zjs-component_text="Sports" data-zjs-component_type="link" data-zjs-container_id="" data-zjs-container_type="navigation" data-zjs-destination_url="https://edition.cnn.com/sport" data-zjs-page_type="article" data-zjs-page_variant="article_leaf" data-zjs-navigation-type="sub" data-zjs-navigation-location="footer">
      Sports
    </a>
    <ul class="subnav__subsections">
      <li class="subnav__subsection">
        <a href="https://edition.cnn.com/sport/football" aria-label="Sports Football" class="subnav__subsection-link" data-zjs="click" data-zjs-component_id="https://edition.cnn.com/sport/football" data-zjs-component_text="Football" data-zjs-component_type="link" data-zjs-container_id="" data-zjs-container_type="navigation" data-zjs-destination_url="https://edition.cnn.com/sport/football" data-zjs-page_type="article" data-zjs-page_variant="article_leaf" data-zjs-navigation-type="sub" data-zjs-navigation-location="footer">
          Football
        </a>
      </li>
      <li class="subnav__subsection">
        <a href="https://edition.cnn.com/sport/tennis" aria-label="Sports Tennis" class="subnav__subsection-link" data-zjs="click" data-zjs-component_id="https://edition.cnn.com/sport/tennis" data-zjs-component_text="Tennis" data-zjs-component_type="link" data-zjs-container_id="" data-zjs-container_type="navigation" data-zjs-destination_url="https://edition.cnn.com/sport/tennis" data-zjs-page_type="article" data-zjs-page_variant="article_leaf" data-zjs-navigation-type="sub" data-zjs-navigation-location="footer">
          Tennis
        </a>
      </li>
      <li class="subnav__subsection">
        <a href="https://edition.cnn.com/sport/golf" aria-label="Sports Golf" class="subnav__subsection-link" data-zjs="click" data-zjs-component_id="https://edition.cnn.com/sport/golf" data-zjs-component_text="Golf" data-zjs-component_type="link" data-zjs-container_id="" data-zjs-container_type="navigation" data-zjs-destination_url="https://edition.cnn.com/sport/golf" data-zjs-page_type="article" data-zjs-page_variant="article_leaf" data-zjs-navigation-type="sub" data-zjs-navigation-location="footer">
          Golf
        </a>
      </li>
      <li class="subnav__subsection">
        <a href="https://edition.cnn.com/sport/motorsport" aria-label="Sports Motorsport" class="subnav__subsection-link" data-zjs="click" data-zjs-component_id="https://edition.cnn.com/sport/motorsport" data-zjs-component_text="Motorsport" data-zjs-component_type="link" data-zjs-container_id="" data-zjs-container_type="navigation" data-zjs-destination_url="https://edition.cnn.com/sport/motorsport" data-zjs-page_type="article" data-zjs-page_variant="article_leaf" data-zjs-navigation-type="sub" data-zjs-navigation-location="footer">
          Motorsport
        </a>
      </li>
      <li class="subnav__subsection">
        <a href="https://edition.cnn.com/sport/us-sports" aria-label="Sports US Sports" class="subnav__subsection-link" data-zjs="click" data-zjs-component_id="https://edition.cnn.com/sport/us-sports" data-zjs-component_text="US Sports" data-zjs-component_type="link" data-zjs-container_id="" data-zjs-container_type="navigation" data-zjs-destination_url="https://edition.cnn.com/sport/us-sports" data-zjs-page_type="article" data-zjs-page_variant="article_leaf" data-zjs-navigation-type="sub" data-zjs-navigation-location="footer">
          US Sports
        </a>
      </li>
      <li class="subnav__subsection">
        <a href="https://edition.cnn.com/sport/paris-olympics-2024" aria-label="Sports Olympics" class="subnav__subsection-link" data-zjs="click" data-zjs-component_id="https://edition.cnn.com/sport/paris-olympics-2024" data-zjs-component_text="Olympics" data-zjs-component_type="link" data-zjs-container_id="" data-zjs-container_type="navigation" data-zjs-destination_url="https://edition.cnn.com/sport/paris-olympics-2024" data-zjs-page_type="article" data-zjs-page_variant="article_leaf" data-zjs-navigation-type="sub" data-zjs-navigation-location="footer">
          Olympics
        </a>
      </li>
      <li class="subnav__subsection">
        <a href="https://edition.cnn.com/sport/climbing" aria-label="Sports Climbing" class="subnav__subsection-link" data-zjs="click" data-zjs-component_id="https://edition.cnn.com/sport/climbing" data-zjs-component_text="Climbing" data-zjs-component_type="link" data-zjs-container_id="" data-zjs-container_type="navigation" data-zjs-destination_url="https://edition.cnn.com/sport/climbing" data-zjs-page_type="article" data-zjs-page_variant="article_leaf" data-zjs-navigation-type="sub" data-zjs-navigation-location="footer">
          Climbing
        </a>
      </li>
      <li class="subnav__subsection">
        <a href="https://edition.cnn.com/sport/esports" aria-label="Sports Esports" class="subnav__subsection-link" data-zjs="click" data-zjs-component_id="https://edition.cnn.com/sport/esports" data-zjs-component_text="Esports" data-zjs-component_type="link" data-zjs-container_id="" data-zjs-container_type="navigation" data-zjs-destination_url="https://edition.cnn.com/sport/esports" data-zjs-page_type="article" data-zjs-page_variant="article_leaf" data-zjs-navigation-type="sub" data-zjs-navigation-location="footer">
          Esports
        </a>
      </li>
      <li class="subnav__subsection">
        <a href="https://bleacherreport.com/nhl" target="_blank" aria-label="Sports Hockey" class="subnav__subsection-link" rel="noopener noreferrer" data-zjs="click" data-zjs-component_id="https://bleacherreport.com/nhl" data-zjs-component_text="Hockey" data-zjs-component_type="link" data-zjs-container_id="" data-zjs-container_type="navigation" data-zjs-destination_url="https://bleacherreport.com/nhl" data-zjs-page_type="article" data-zjs-page_variant="article_leaf" data-zjs-navigation-type="sub" data-zjs-navigation-location="footer">
          Hockey
        </a>
      </li>
    </ul>
  </li>
  <li class="subnav__section">
    <a href="https://edition.cnn.com/videos" class="subnav__section-link" data-zjs="click" data-zjs-component_id="https://edition.cnn.com/videos" data-zjs-component_text="Videos" data-zjs-component_type="link" data-zjs-container_id="" data-zjs-container_type="navigation" data-zjs-destination_url="https://edition.cnn.com/videos" data-zjs-page_type="article" data-zjs-page_variant="article_leaf" data-zjs-navigation-type="sub" data-zjs-navigation-location="footer">
      Videos
    </a>
    <ul class="subnav__subsections">
      <li class="subnav__subsection">
        <a href="https://edition.cnn.com/live-tv" aria-label="Videos Live TV" class="subnav__subsection-link" data-zjs="click" data-zjs-component_id="https://edition.cnn.com/live-tv" data-zjs-component_text="Live TV" data-zjs-component_type="link" data-zjs-container_id="" data-zjs-container_type="navigation" data-zjs-destination_url="https://edition.cnn.com/live-tv" data-zjs-page_type="article" data-zjs-page_variant="article_leaf" data-zjs-navigation-type="sub" data-zjs-navigation-location="footer">
          Live TV
        </a>
      </li>
      <li class="subnav__subsection">
        <a href="https://edition.cnn.com/specials/digital-studios" aria-label="Videos Digital Studios" class="subnav__subsection-link" data-zjs="click" data-zjs-component_id="https://edition.cnn.com/specials/digital-studios" data-zjs-component_text="Digital Studios" data-zjs-component_type="link" data-zjs-container_id="" data-zjs-container_type="navigation" data-zjs-destination_url="https://edition.cnn.com/specials/digital-studios" data-zjs-page_type="article" data-zjs-page_variant="article_leaf" data-zjs-navigation-type="sub" data-zjs-navigation-location="footer">
          Digital Studios
        </a>
      </li>
      <li class="subnav__subsection">
        <a href="https://edition.cnn.com/specials/videos/digital-shorts" aria-label="Videos CNN Films" class="subnav__subsection-link" data-zjs="click" data-zjs-component_id="https://edition.cnn.com/specials/videos/digital-shorts" data-zjs-component_text="CNN Films" data-zjs-component_type="link" data-zjs-container_id="" data-zjs-container_type="navigation" data-zjs-destination_url="https://edition.cnn.com/specials/videos/digital-shorts" data-zjs-page_type="article" data-zjs-page_variant="article_leaf" data-zjs-navigation-type="sub" data-zjs-navigation-location="footer">
          CNN Films
        </a>
      </li>
      <li class="subnav__subsection">
        <a href="https://edition.cnn.com/specials/videos/hln" aria-label="Videos HLN" class="subnav__subsection-link" data-zjs="click" data-zjs-component_id="https://edition.cnn.com/specials/videos/hln" data-zjs-component_text="HLN" data-zjs-component_type="link" data-zjs-container_id="" data-zjs-container_type="navigation" data-zjs-destination_url="https://edition.cnn.com/specials/videos/hln" data-zjs-page_type="article" data-zjs-page_variant="article_leaf" data-zjs-navigation-type="sub" data-zjs-navigation-location="footer">
          HLN
        </a>
      </li>
      <li class="subnav__subsection">
        <a href="https://edition.cnn.com/tv/schedule/cnn" aria-label="Videos TV Schedule" class="subnav__subsection-link" data-zjs="click" data-zjs-component_id="https://edition.cnn.com/tv/schedule/cnn" data-zjs-component_text="TV Schedule" data-zjs-component_type="link" data-zjs-container_id="" data-zjs-container_type="navigation" data-zjs-destination_url="https://edition.cnn.com/tv/schedule/cnn" data-zjs-page_type="article" data-zjs-page_variant="article_leaf" data-zjs-navigation-type="sub" data-zjs-navigation-location="footer">
          TV Schedule
        </a>
      </li>
      <li class="subnav__subsection">
        <a href="https://edition.cnn.com/specials/tv/all-shows" aria-label="Videos TV Shows A-Z" class="subnav__subsection-link" data-zjs="click" data-zjs-component_id="https://edition.cnn.com/specials/tv/all-shows" data-zjs-component_text="TV Shows A-Z" data-zjs-component_type="link" data-zjs-container_id="" data-zjs-container_type="navigation" data-zjs-destination_url="https://edition.cnn.com/specials/tv/all-shows" data-zjs-page_type="article" data-zjs-page_variant="article_leaf" data-zjs-navigation-type="sub" data-zjs-navigation-location="footer">
          TV Shows A-Z
        </a>
      </li>
      <li class="subnav__subsection">
        <a href="https://edition.cnn.com/vr" aria-label="Videos CNNVR" class="subnav__subsection-link" data-zjs="click" data-zjs-component_id="https://edition.cnn.com/vr" data-zjs-component_text="CNNVR" data-zjs-component_type="link" data-zjs-container_id="" data-zjs-container_type="navigation" data-zjs-destination_url="https://edition.cnn.com/vr" data-zjs-page_type="article" data-zjs-page_variant="article_leaf" data-zjs-navigation-type="sub" data-zjs-navigation-location="footer">
          CNNVR
        </a>
      </li>
    </ul>
  </li>
  <li class="subnav__section">
    <a href="https://edition.cnn.com/specials" class="subnav__section-link" data-zjs="click" data-zjs-component_id="https://edition.cnn.com/specials" data-zjs-component_text="Features" data-zjs-component_type="link" data-zjs-container_id="" data-zjs-container_type="navigation" data-zjs-destination_url="https://edition.cnn.com/specials" data-zjs-page_type="article" data-zjs-page_variant="article_leaf" data-zjs-navigation-type="sub" data-zjs-navigation-location="footer">
      Features
    </a>
    <ul class="subnav__subsections">
      <li class="subnav__subsection">
        <a href="https://edition.cnn.com/interactive/asequals" aria-label="Features As Equals" class="subnav__subsection-link" data-zjs="click" data-zjs-component_id="https://edition.cnn.com/interactive/asequals" data-zjs-component_text="As Equals" data-zjs-component_type="link" data-zjs-container_id="" data-zjs-container_type="navigation" data-zjs-destination_url="https://edition.cnn.com/interactive/asequals" data-zjs-page_type="article" data-zjs-page_variant="article_leaf" data-zjs-navigation-type="sub" data-zjs-navigation-location="footer">
          As Equals
        </a>
      </li>
      <li class="subnav__subsection">
        <a href="https://edition.cnn.com/interactive/call-to-earth" aria-label="Features Call to Earth" class="subnav__subsection-link" data-zjs="click" data-zjs-component_id="https://edition.cnn.com/interactive/call-to-earth" data-zjs-component_text="Call to Earth" data-zjs-component_type="link" data-zjs-container_id="" data-zjs-container_type="navigation" data-zjs-destination_url="https://edition.cnn.com/interactive/call-to-earth" data-zjs-page_type="article" data-zjs-page_variant="article_leaf" data-zjs-navigation-type="sub" data-zjs-navigation-location="footer">
          Call to Earth
        </a>
      </li>
      <li class="subnav__subsection">
        <a href="https://edition.cnn.com/specials/world/freedom-project" aria-label="Features Freedom Project" class="subnav__subsection-link" data-zjs="click" data-zjs-component_id="https://edition.cnn.com/specials/world/freedom-project" data-zjs-component_text="Freedom Project" data-zjs-component_type="link" data-zjs-container_id="" data-zjs-container_type="navigation" data-zjs-destination_url="https://edition.cnn.com/specials/world/freedom-project" data-zjs-page_type="article" data-zjs-page_variant="article_leaf" data-zjs-navigation-type="sub" data-zjs-navigation-location="footer">
          Freedom Project
        </a>
      </li>
      <li class="subnav__subsection">
        <a href="https://edition.cnn.com/specials/impact-your-world" aria-label="Features Impact Your World" class="subnav__subsection-link" data-zjs="click" data-zjs-component_id="https://edition.cnn.com/specials/impact-your-world" data-zjs-component_text="Impact Your World" data-zjs-component_type="link" data-zjs-container_id="" data-zjs-container_type="navigation" data-zjs-destination_url="https://edition.cnn.com/specials/impact-your-world" data-zjs-page_type="article" data-zjs-page_variant="article_leaf" data-zjs-navigation-type="sub" data-zjs-navigation-location="footer">
          Impact Your World
        </a>
      </li>
      <li class="subnav__subsection">
        <a href="https://edition.cnn.com/specials/africa/inside-africa" aria-label="Features Inside Africa" class="subnav__subsection-link" data-zjs="click" data-zjs-component_id="https://edition.cnn.com/specials/africa/inside-africa" data-zjs-component_text="Inside Africa" data-zjs-component_type="link" data-zjs-container_id="" data-zjs-container_type="navigation" data-zjs-destination_url="https://edition.cnn.com/specials/africa/inside-africa" data-zjs-page_type="article" data-zjs-page_variant="article_leaf" data-zjs-navigation-type="sub" data-zjs-navigation-location="footer">
          Inside Africa
        </a>
      </li>
      <li class="subnav__subsection">
        <a href="https://edition.cnn.com/specials/opinions/two-degrees" aria-label="Features 2 Degrees" class="subnav__subsection-link" data-zjs="click" data-zjs-component_id="https://edition.cnn.com/specials/opinions/two-degrees" data-zjs-component_text="2 Degrees" data-zjs-component_type="link" data-zjs-container_id="" data-zjs-container_type="navigation" data-zjs-destination_url="https://edition.cnn.com/specials/opinions/two-degrees" data-zjs-page_type="article" data-zjs-page_variant="article_leaf" data-zjs-navigation-type="sub" data-zjs-navigation-location="footer">
          2 Degrees
        </a>
      </li>
      <li class="subnav__subsection">
        <a href="https://edition.cnn.com/specials/cnn-heroes" aria-label="Features CNN Heroes" class="subnav__subsection-link" data-zjs="click" data-zjs-component_id="https://edition.cnn.com/specials/cnn-heroes" data-zjs-component_text="CNN Heroes" data-zjs-component_type="link" data-zjs-container_id="" data-zjs-container_type="navigation" data-zjs-destination_url="https://edition.cnn.com/specials/cnn-heroes" data-zjs-page_type="article" data-zjs-page_variant="article_leaf" data-zjs-navigation-type="sub" data-zjs-navigation-location="footer">
          CNN Heroes
        </a>
      </li>
      <li class="subnav__subsection">
        <a href="https://edition.cnn.com/specials" aria-label="Features All Features" class="subnav__subsection-link" data-zjs="click" data-zjs-component_id="https://edition.cnn.com/specials" data-zjs-component_text="All Features" data-zjs-component_type="link" data-zjs-container_id="" data-zjs-container_type="navigation" data-zjs-destination_url="https://edition.cnn.com/specials" data-zjs-page_type="article" data-zjs-page_variant="article_leaf" data-zjs-navigation-type="sub" data-zjs-navigation-location="footer">
          All Features
        </a>
      </li>
    </ul>
  </li>
  <li class="subnav__section">
    <a href="https://edition.cnn.com/weather" class="subnav__section-link" data-zjs="click" data-zjs-component_id="https://edition.cnn.com/weather" data-zjs-component_text="Weather" data-zjs-component_type="link" data-zjs-container_id="" data-zjs-container_type="navigation" data-zjs-destination_url="https://edition.cnn.com/weather" data-zjs-page_type="article" data-zjs-page_variant="article_leaf" data-zjs-navigation-type="sub" data-zjs-navigation-location="footer">
      Weather
    </a>
    <ul class="subnav__subsections">
      <li class="subnav__subsection">
        <a href="https://edition.cnn.com/specials/world/cnn-climate" aria-label="Weather Climate" class="subnav__subsection-link" data-zjs="click" data-zjs-component_id="https://edition.cnn.com/specials/world/cnn-climate" data-zjs-component_text="Climate" data-zjs-component_type="link" data-zjs-container_id="" data-zjs-container_type="navigation" data-zjs-destination_url="https://edition.cnn.com/specials/world/cnn-climate" data-zjs-page_type="article" data-zjs-page_variant="article_leaf" data-zjs-navigation-type="sub" data-zjs-navigation-location="footer">
          Climate
        </a>
      </li>
      <li class="subnav__subsection">
        <a href="https://edition.cnn.com/interactive/2020/weather/wildfire-and-air-quality-tracker" aria-label="Weather Wildfire Tracker" class="subnav__subsection-link" data-zjs="click" data-zjs-component_id="https://edition.cnn.com/interactive/2020/weather/wildfire-and-air-quality-tracker" data-zjs-component_text="Wildfire Tracker" data-zjs-component_type="link" data-zjs-container_id="" data-zjs-container_type="navigation" data-zjs-destination_url="https://edition.cnn.com/interactive/2020/weather/wildfire-and-air-quality-tracker" data-zjs-page_type="article" data-zjs-page_variant="article_leaf" data-zjs-navigation-type="sub" data-zjs-navigation-location="footer">
          Wildfire Tracker
        </a>
      </li>
      <li class="subnav__subsection">
        <a href="https://edition.cnn.com/specials/weather/weather-video" aria-label="Weather Video" class="subnav__subsection-link" data-zjs="click" data-zjs-component_id="https://edition.cnn.com/specials/weather/weather-video" data-zjs-component_text="Video" data-zjs-component_type="link" data-zjs-container_id="" data-zjs-container_type="navigation" data-zjs-destination_url="https://edition.cnn.com/specials/weather/weather-video" data-zjs-page_type="article" data-zjs-page_variant="article_leaf" data-zjs-navigation-type="sub" data-zjs-navigation-location="footer">
          Video
        </a>
      </li>
    </ul>
  </li>
  <li class="subnav__section">
    <a href="https://edition.cnn.com/more" aria-label="More CNN" class="subnav__section-link" data-zjs="click" data-zjs-component_id="https://edition.cnn.com/more" data-zjs-component_text="More" data-zjs-component_type="link" data-zjs-container_id="" data-zjs-container_type="navigation" data-zjs-destination_url="https://edition.cnn.com/more" data-zjs-page_type="article" data-zjs-page_variant="article_leaf" data-zjs-navigation-type="sub" data-zjs-navigation-location="footer">
      More
    </a>
    <ul class="subnav__subsections">
      <li class="subnav__subsection">
        <a href="https://edition.cnn.com/specials/photos" aria-label="More Photos" class="subnav__subsection-link" data-zjs="click" data-zjs-component_id="https://edition.cnn.com/specials/photos" data-zjs-component_text="Photos" data-zjs-component_type="link" data-zjs-container_id="" data-zjs-container_type="navigation" data-zjs-destination_url="https://edition.cnn.com/specials/photos" data-zjs-page_type="article" data-zjs-page_variant="article_leaf" data-zjs-navigation-type="sub" data-zjs-navigation-location="footer">
          Photos
        </a>
      </li>
      <li class="subnav__subsection">
        <a href="https://edition.cnn.com/specials/cnn-longform" aria-label="More Longform" class="subnav__subsection-link" data-zjs="click" data-zjs-component_id="https://edition.cnn.com/specials/cnn-longform" data-zjs-component_text="Longform" data-zjs-component_type="link" data-zjs-container_id="" data-zjs-container_type="navigation" data-zjs-destination_url="https://edition.cnn.com/specials/cnn-longform" data-zjs-page_type="article" data-zjs-page_variant="article_leaf" data-zjs-navigation-type="sub" data-zjs-navigation-location="footer">
          Longform
        </a>
      </li>
      <li class="subnav__subsection">
        <a href="https://edition.cnn.com/specials/cnn-investigates" aria-label="More Investigations" class="subnav__subsection-link" data-zjs="click" data-zjs-component_id="https://edition.cnn.com/specials/cnn-investigates" data-zjs-component_text="Investigations" data-zjs-component_type="link" data-zjs-container_id="" data-zjs-container_type="navigation" data-zjs-destination_url="https://edition.cnn.com/specials/cnn-investigates" data-zjs-page_type="article" data-zjs-page_variant="article_leaf" data-zjs-navigation-type="sub" data-zjs-navigation-location="footer">
          Investigations
        </a>
      </li>
      <li class="subnav__subsection">
        <a href="https://edition.cnn.com/specials/profiles" aria-label="More CNN Profiles" class="subnav__subsection-link" data-zjs="click" data-zjs-component_id="https://edition.cnn.com/specials/profiles" data-zjs-component_text="CNN Profiles" data-zjs-component_type="link" data-zjs-container_id="" data-zjs-container_type="navigation" data-zjs-destination_url="https://edition.cnn.com/specials/profiles" data-zjs-page_type="article" data-zjs-page_variant="article_leaf" data-zjs-navigation-type="sub" data-zjs-navigation-location="footer">
          CNN Profiles
        </a>
      </li>
      <li class="subnav__subsection">
        <a href="https://edition.cnn.com/specials/more/cnn-leadership" aria-label="More CNN Leadership" class="subnav__subsection-link" data-zjs="click" data-zjs-component_id="https://edition.cnn.com/specials/more/cnn-leadership" data-zjs-component_text="CNN Leadership" data-zjs-component_type="link" data-zjs-container_id="" data-zjs-container_type="navigation" data-zjs-destination_url="https://edition.cnn.com/specials/more/cnn-leadership" data-zjs-page_type="article" data-zjs-page_variant="article_leaf" data-zjs-navigation-type="sub" data-zjs-navigation-location="footer">
          CNN Leadership
        </a>
      </li>
      <li class="subnav__subsection">
        <a href="https://edition.cnn.com/email/subscription" aria-label="More CNN Newsletters" class="subnav__subsection-link" data-zjs="click" data-zjs-component_id="https://edition.cnn.com/email/subscription" data-zjs-component_text="CNN Newsletters" data-zjs-component_type="link" data-zjs-container_id="" data-zjs-container_type="navigation" data-zjs-destination_url="https://edition.cnn.com/email/subscription" data-zjs-page_type="article" data-zjs-page_variant="article_leaf" data-zjs-navigation-type="sub" data-zjs-navigation-location="footer">
          CNN Newsletters
        </a>
      </li>
      <li class="subnav__subsection">
        <a href="https://careers.wbd.com/cnnjobs" target="_blank" aria-label="More Work for CNN" class="subnav__subsection-link" data-zjs="click" data-zjs-component_id="https://careers.wbd.com/cnnjobs" data-zjs-component_text="Work for CNN" data-zjs-component_type="link" data-zjs-container_id="" data-zjs-container_type="navigation" data-zjs-destination_url="https://careers.wbd.com/cnnjobs" data-zjs-page_type="article" data-zjs-page_variant="article_leaf" data-zjs-navigation-type="sub" data-zjs-navigation-location="footer">
          Work for CNN
        </a>
      </li>
    </ul>
  </li>
</ul>
</nav>

    </div>
    <hr class="footer__divider">
  <div class="footer__row">
      <div class="footer__brand-logo">
          <div data-uri="cms.cnn.com/_components/brand-logo/instances/new-business-footer-v2@published" class="brand-logo" data-editable="settings">
    <a class="brand-logo__logo-link" href="https://edition.cnn.com" title="CNN logo" data-zjs="click" data-zjs-component_id="https://edition.cnn.com" data-zjs-component_text="Main Logo" data-zjs-component_type="icon" data-zjs-container_id="" data-zjs-container_type="navigation" data-zjs-destination_url="https://edition.cnn.com" data-zjs-page_type="article" data-zjs-page_variant="article_leaf">
      <span class="brand-logo__logo">
              <svg width="40" height="40" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
<path fill-rule="evenodd" clip-rule="evenodd" d="M0 39.9998H39.9998V0H0V39.9998Z" fill="#CC0000"></path>
<path fill-rule="evenodd" clip-rule="evenodd" d="M8.12557 19.9999C8.12557 18.3172 9.4899 16.9532 11.1724 16.9532H13.4842V15.2271H11.1536C8.52173 15.2271 6.3804 17.3681 6.3804 20.0001C6.3804 22.6317 8.52173 24.7731 11.1536 24.7731L15.6412 24.7729C15.8922 24.7729 16.0941 24.5261 16.0941 24.3216V15.4811C16.0941 14.9937 16.3997 14.5829 16.8544 14.4589C17.2424 14.3532 17.7864 14.4604 18.1499 15.0784C18.1669 15.1069 19.2694 17.0074 20.9497 19.9039C22.2684 22.1781 23.6327 24.5298 23.6574 24.5716C23.7984 24.8113 23.9921 24.9246 24.1761 24.8746C24.2919 24.8431 24.4277 24.7309 24.4277 24.5184V15.4811C24.4279 14.9931 24.7324 14.5821 25.1854 14.4586C25.5709 14.3537 26.1122 14.4612 26.4756 15.0784C26.4917 15.1054 27.4664 16.7862 29.0702 19.5509C30.4886 21.9959 31.9551 24.5244 31.9827 24.5714C32.1239 24.8113 32.3179 24.9246 32.5016 24.8746C32.6174 24.8431 32.7532 24.7309 32.7532 24.5186V12.8104H31.0231V19.7811C31.0231 19.7811 28.1327 14.8016 27.9999 14.5761C26.1649 11.4592 22.6976 12.7474 22.6976 15.4306V19.7811C22.6976 19.7811 19.8072 14.8016 19.6744 14.5761C17.8394 11.4592 14.3722 12.7474 14.3721 15.4306V22.5611C14.3729 22.8204 14.1779 23.0464 13.8941 23.0468H11.1724C9.4899 23.0468 8.12557 21.6826 8.12557 19.9999Z" fill="white"></path>
<path fill-rule="evenodd" clip-rule="evenodd" d="M33.4436 12.8104V24.5185C33.4436 25.0059 33.1379 25.4169 32.6833 25.5409C32.5996 25.5635 32.5088 25.5765 32.4139 25.5765C32.0689 25.5765 31.6731 25.406 31.3876 24.9214C31.3723 24.8954 30.2236 22.915 28.4733 19.8972C27.2103 17.7204 25.9046 15.4695 25.8804 15.4284C25.7394 15.189 25.5478 15.0754 25.3668 15.1247C25.2523 15.156 25.1181 15.2682 25.1181 15.4812V24.5185C25.1181 25.006 24.8124 25.4169 24.3576 25.5409C23.9696 25.6464 23.4258 25.5394 23.0621 24.9214C23.0474 24.8964 21.9794 23.0557 20.3524 20.2502C18.9894 17.901 17.5803 15.4715 17.5549 15.4284C17.4136 15.1885 17.2196 15.075 17.0361 15.125C16.9201 15.1567 16.7848 15.2689 16.7848 15.481L16.7844 24.3215C16.7844 24.9299 16.2503 25.4634 15.6413 25.4634H11.1536C8.14093 25.4634 5.6901 23.0125 5.6901 20C5.6901 16.9874 8.14093 14.5364 11.1536 14.5364H13.4843V12.8104H11.1554C7.18477 12.8104 3.96577 16.0292 3.96577 20C3.96577 23.9705 7.18477 27.1894 11.1554 27.1894H15.6868C17.4091 27.1905 18.5168 26.1812 18.5149 24.3195V20.2189C18.5149 20.2189 21.4049 25.1982 21.5379 25.4237C23.3729 28.5405 26.8404 27.2524 26.8404 24.5692V20.2189C26.8404 20.2189 29.7308 25.1982 29.8633 25.4237C31.6981 28.5405 35.1656 27.2524 35.1659 24.5692V12.8104H33.4436Z" fill="white"></path>
</svg>

      </span>
      </a>
  <a class="brand-logo__theme-link" href="https://edition.cnn.com/business" data-zjs="click" data-zjs-component_id="https://edition.cnn.com/business" data-zjs-component_text="" data-zjs-component_type="icon" data-zjs-container_id="" data-zjs-container_type="navigation" data-zjs-destination_url="https://edition.cnn.com/business" data-zjs-page_type="article" data-zjs-page_variant="article_leaf">
          <span class="brand-logo__theme">
              <svg width="108" height="40" viewBox="0 0 108 40" fill="none" xmlns="http://www.w3.org/2000/svg">
<g clip-path="url(#clip0_2_20)">
<path d="M105.98 33.4319L101.024 27.7101L96.0636 33.4339L105.98 33.4319Z" fill="#00C59E"></path>
<mask id="mask0_2_20" style="mask-type:alpha" maskUnits="userSpaceOnUse" x="4" y="6" width="92" height="28">
<path d="M90.5013 6C92.156 6 93.4403 6.39498 94.3542 7.18493C95.268 7.97488 95.725 9.04619 95.725 10.3988V16.1449H91.7423V11.3971C91.7423 10.8209 91.6483 10.4198 91.4604 10.1939C91.2725 9.96802 90.9656 9.85508 90.5398 9.85508C90.095 9.85643 89.7787 9.97681 89.5908 10.2162C89.4029 10.4557 89.3089 10.8506 89.3089 11.4012V14.0064C89.3333 14.4443 89.462 14.87 89.6841 15.2481C89.9342 15.7243 90.5729 16.6136 91.6004 17.9162C93.1753 19.8952 94.2568 21.3486 94.8449 22.2765C95.433 23.2044 95.727 23.9815 95.727 24.6078V29.4064L93.8452 31.5794L92.0201 33.6835C91.5156 33.7786 91.0079 33.8234 90.4992 33.8215C88.8716 33.8215 87.6008 33.4265 86.6869 32.6365C85.773 31.8466 85.3161 30.7753 85.3161 29.4226V23.1449H89.2907V28.4203C89.2907 28.9465 89.3785 29.3347 89.5543 29.5849C89.73 29.8365 90.0558 29.9616 90.5317 29.9603C91.0076 29.9589 91.3273 29.8271 91.4909 29.5646C91.6741 29.2116 91.7582 28.8154 91.7342 28.4183V26.1133C91.7069 25.3418 91.4805 24.5904 91.0772 23.9322C90.6378 23.1558 89.7922 22.0155 88.5404 20.5113C87.6311 19.4506 86.8169 18.3121 86.107 17.1087C85.5811 16.1686 85.3181 15.2853 85.3181 14.4588V10.3623C85.3127 9.03401 85.7697 7.97488 86.6889 7.18493C87.6082 6.39498 88.879 6 90.5013 6ZM35.3544 6C37.0078 6 38.2921 6.39498 39.2073 7.18493C40.1225 7.97489 40.5795 9.04619 40.5781 10.3988H40.5761V16.1449H36.5934V11.4012C36.5934 10.8249 36.4995 10.4239 36.3116 10.198C36.1237 9.97208 35.8161 9.85778 35.3889 9.85508C34.9387 9.85508 34.6197 9.97411 34.4318 10.2122C34.2439 10.4502 34.1499 10.8445 34.1499 11.3951V14.0064C34.1742 14.4443 34.3029 14.87 34.525 15.2481C34.7751 15.7243 35.4139 16.6136 36.4413 17.9162C38.019 19.8965 39.1005 21.35 39.6859 22.2765C40.2712 23.2031 40.5653 23.9802 40.568 24.6078V29.4206C40.568 30.7732 40.111 31.8445 39.1972 32.6345C38.2833 33.4245 36.999 33.8194 35.3443 33.8194C33.722 33.8194 32.4506 33.4245 31.5299 32.6345C30.6093 31.8445 30.1524 30.7732 30.159 29.4206V23.1429H34.1519V28.4183C34.1519 28.9445 34.2398 29.3327 34.4155 29.5829C34.5913 29.8331 34.9171 29.9583 35.393 29.9583C35.8688 29.9583 36.1885 29.8264 36.3521 29.5626C36.5355 29.2096 36.6196 28.8134 36.5955 28.4162V26.1113C36.5679 25.3398 36.3415 24.5885 35.9384 23.9302C35.4991 23.1537 34.6535 22.0134 33.4016 20.5093C32.4925 19.4485 31.6783 18.31 30.9682 17.1067C30.4423 16.1666 30.1794 15.2833 30.1794 14.4568V10.3603C30.1794 9.03199 30.6363 7.97286 31.5502 7.18291C32.4641 6.39295 33.7322 5.99865 35.3544 6ZM78.3424 6C79.9958 6 81.2801 6.39498 82.1953 7.18493C83.1105 7.97489 83.5675 9.04619 83.5661 10.3988H83.5641V16.1449H79.5814V11.4012C79.5814 10.8249 79.4875 10.4239 79.2996 10.198C79.1117 9.97208 78.8048 9.85778 78.3789 9.85508C77.9274 9.85508 77.6077 9.97411 77.4198 10.2122C77.2319 10.4502 77.1379 10.8445 77.1379 11.3951V14.0064C77.1623 14.4443 77.2909 14.87 77.513 15.2481C77.7631 15.7243 78.4019 16.6136 79.4294 17.9162C81.007 19.8965 82.0885 21.35 82.6739 22.2765C83.2592 23.2031 83.5533 23.9802 83.556 24.6078V29.4206C83.556 30.7732 83.099 31.8445 82.1852 32.6345C81.2713 33.4245 79.987 33.8194 78.3323 33.8194C76.71 33.8194 75.4393 33.4245 74.52 32.6345C73.6007 31.8445 73.1437 30.7732 73.1491 29.4206V23.1429H77.1318V28.4183C77.1318 28.9445 77.2197 29.3327 77.3954 29.5829C77.5712 29.8331 77.897 29.9583 78.3728 29.9583C78.8487 29.9583 79.1684 29.8264 79.332 29.5626C79.5152 29.2095 79.5993 28.8133 79.5754 28.4162V26.1113C79.5478 25.3398 79.3214 24.5885 78.9183 23.9302C78.4884 23.1537 77.6449 22.0141 76.3876 20.5113C75.4784 19.4506 74.6641 18.3121 73.9542 17.1087C73.4283 16.1686 73.1654 15.2853 73.1654 14.4588V10.3603C73.1654 9.03199 73.6223 7.97286 74.5362 7.18291C75.4501 6.39295 76.7188 5.99865 78.3424 6ZM21.1433 6.4058V27.7528C21.1433 28.9133 21.5489 29.6742 22.4472 29.6742C23.4246 29.6742 23.7876 28.9499 23.7876 27.7528V6.4058H27.9528V27.5072C27.9528 31.3136 26.4319 33.7038 22.8102 33.7038H22.0862C18.4625 33.6936 16.9781 31.3765 16.9781 27.4991V6.4058H21.1433ZM10.4465 6.4058C13.8512 6.4058 14.7577 8.18116 14.7577 10.7904V14.9235C14.7577 17.1716 13.7802 18.2571 12.7298 18.6568C13.8167 19.02 15.0841 19.9249 15.0841 22.6073V28.4426C15.0841 31.3055 13.8167 33.371 10.7385 33.371H4V6.4058H10.4465ZM46.8238 6.4058V33.369H42.7316V6.4058H46.8238ZM52.9154 6.4058L56.4276 20.8664V6.4058H60.1588V33.369H56.8271L52.9154 17.8574V33.369H49.2207V6.4058H52.9154ZM71.7114 6.4058V10.3197H66.4958V17.3867H70.588V21.4832H66.4958V29.2745H71.9284V33.369H62.4016V6.4058H71.7114ZM8.09217 21.0754V29.5565H9.3332C10.6371 29.5565 10.9271 28.9478 10.9271 27.7446V22.8223C10.9271 21.6983 10.6371 21.0835 9.3332 21.0835L8.09217 21.0754ZM8.09217 10.058V17.0559H9.3332C10.4201 17.0559 10.7527 16.2951 10.7527 15.171V11.7704C10.7527 10.6829 10.4627 10.0681 9.3332 10.0681L8.09217 10.058Z" fill="white"></path>
</mask>
<g mask="url(#mask0_2_20)">
<path d="M90.5013 6C92.156 6 93.4403 6.39498 94.3542 7.18493C95.268 7.97488 95.725 9.04619 95.725 10.3988V16.1449H91.7423V11.3971C91.7423 10.8209 91.6483 10.4198 91.4604 10.1939C91.2725 9.96802 90.9656 9.85508 90.5398 9.85508C90.095 9.85643 89.7787 9.97681 89.5908 10.2162C89.4029 10.4557 89.3089 10.8506 89.3089 11.4012V14.0064C89.3333 14.4443 89.462 14.87 89.6841 15.2481C89.9342 15.7243 90.5729 16.6136 91.6004 17.9162C93.1753 19.8952 94.2568 21.3486 94.8449 22.2765C95.433 23.2044 95.727 23.9815 95.727 24.6078V29.4064L93.8452 31.5794L92.0201 33.6835C91.5156 33.7786 91.0079 33.8234 90.4992 33.8215C88.8716 33.8215 87.6008 33.4265 86.6869 32.6365C85.773 31.8466 85.3161 30.7753 85.3161 29.4226V23.1449H89.2907V28.4203C89.2907 28.9465 89.3785 29.3347 89.5543 29.5849C89.73 29.8365 90.0558 29.9616 90.5317 29.9603C91.0076 29.9589 91.3273 29.8271 91.4909 29.5646C91.6741 29.2116 91.7582 28.8154 91.7342 28.4183V26.1133C91.7069 25.3418 91.4805 24.5904 91.0772 23.9322C90.6378 23.1558 89.7922 22.0155 88.5404 20.5113C87.6311 19.4506 86.8169 18.3121 86.107 17.1087C85.5811 16.1686 85.3181 15.2853 85.3181 14.4588V10.3623C85.3127 9.03401 85.7697 7.97488 86.6889 7.18493C87.6082 6.39498 88.879 6 90.5013 6ZM35.3544 6C37.0078 6 38.2921 6.39498 39.2073 7.18493C40.1225 7.97489 40.5795 9.04619 40.5781 10.3988H40.5761V16.1449H36.5934V11.4012C36.5934 10.8249 36.4995 10.4239 36.3116 10.198C36.1237 9.97208 35.8161 9.85778 35.3889 9.85508C34.9387 9.85508 34.6197 9.97411 34.4318 10.2122C34.2439 10.4502 34.1499 10.8445 34.1499 11.3951V14.0064C34.1742 14.4443 34.3029 14.87 34.525 15.2481C34.7751 15.7243 35.4139 16.6136 36.4413 17.9162C38.019 19.8965 39.1005 21.35 39.6859 22.2765C40.2712 23.2031 40.5653 23.9802 40.568 24.6078V29.4206C40.568 30.7732 40.111 31.8445 39.1972 32.6345C38.2833 33.4245 36.999 33.8194 35.3443 33.8194C33.722 33.8194 32.4506 33.4245 31.5299 32.6345C30.6093 31.8445 30.1524 30.7732 30.159 29.4206V23.1429H34.1519V28.4183C34.1519 28.9445 34.2398 29.3327 34.4155 29.5829C34.5913 29.8331 34.9171 29.9583 35.393 29.9583C35.8688 29.9583 36.1885 29.8264 36.3521 29.5626C36.5355 29.2096 36.6196 28.8134 36.5955 28.4162V26.1113C36.5679 25.3398 36.3415 24.5885 35.9384 23.9302C35.4991 23.1537 34.6535 22.0134 33.4016 20.5093C32.4925 19.4485 31.6783 18.31 30.9682 17.1067C30.4423 16.1666 30.1794 15.2833 30.1794 14.4568V10.3603C30.1794 9.03199 30.6363 7.97286 31.5502 7.18291C32.4641 6.39295 33.7322 5.99865 35.3544 6ZM78.3424 6C79.9958 6 81.2801 6.39498 82.1953 7.18493C83.1105 7.97489 83.5675 9.04619 83.5661 10.3988H83.5641V16.1449H79.5814V11.4012C79.5814 10.8249 79.4875 10.4239 79.2996 10.198C79.1117 9.97208 78.8048 9.85778 78.3789 9.85508C77.9274 9.85508 77.6077 9.97411 77.4198 10.2122C77.2319 10.4502 77.1379 10.8445 77.1379 11.3951V14.0064C77.1623 14.4443 77.2909 14.87 77.513 15.2481C77.7631 15.7243 78.4019 16.6136 79.4294 17.9162C81.007 19.8965 82.0885 21.35 82.6739 22.2765C83.2592 23.2031 83.5533 23.9802 83.556 24.6078V29.4206C83.556 30.7732 83.099 31.8445 82.1852 32.6345C81.2713 33.4245 79.987 33.8194 78.3323 33.8194C76.71 33.8194 75.4393 33.4245 74.52 32.6345C73.6007 31.8445 73.1437 30.7732 73.1491 29.4206V23.1429H77.1318V28.4183C77.1318 28.9445 77.2197 29.3327 77.3954 29.5829C77.5712 29.8331 77.897 29.9583 78.3728 29.9583C78.8487 29.9583 79.1684 29.8264 79.332 29.5626C79.5152 29.2095 79.5993 28.8133 79.5754 28.4162V26.1113C79.5478 25.3398 79.3214 24.5885 78.9183 23.9302C78.4884 23.1537 77.6449 22.0141 76.3876 20.5113C75.4784 19.4506 74.6641 18.3121 73.9542 17.1087C73.4283 16.1686 73.1654 15.2853 73.1654 14.4588V10.3603C73.1654 9.03199 73.6223 7.97286 74.5362 7.18291C75.4501 6.39295 76.7188 5.99865 78.3424 6ZM21.1433 6.4058V27.7528C21.1433 28.9133 21.5489 29.6742 22.4472 29.6742C23.4246 29.6742 23.7876 28.9499 23.7876 27.7528V6.4058H27.9528V27.5072C27.9528 31.3136 26.4319 33.7038 22.8102 33.7038H22.0862C18.4625 33.6936 16.9781 31.3765 16.9781 27.4991V6.4058H21.1433ZM10.4465 6.4058C13.8512 6.4058 14.7577 8.18116 14.7577 10.7904V14.9235C14.7577 17.1716 13.7802 18.2571 12.7298 18.6568C13.8167 19.02 15.0841 19.9249 15.0841 22.6073V28.4426C15.0841 31.3055 13.8167 33.371 10.7385 33.371H4V6.4058H10.4465ZM46.8238 6.4058V33.369H42.7316V6.4058H46.8238ZM52.9154 6.4058L56.4276 20.8664V6.4058H60.1588V33.369H56.8271L52.9154 17.8574V33.369H49.2207V6.4058H52.9154ZM71.7114 6.4058V10.3197H66.4958V17.3867H70.588V21.4832H66.4958V29.2745H71.9284V33.369H62.4016V6.4058H71.7114ZM8.09217 21.0754V29.5565H9.3332C10.6371 29.5565 10.9271 28.9478 10.9271 27.7446V22.8223C10.9271 21.6983 10.6371 21.0835 9.3332 21.0835L8.09217 21.0754ZM8.09217 10.058V17.0559H9.3332C10.4201 17.0559 10.7527 16.2951 10.7527 15.171V11.7704C10.7527 10.6829 10.4627 10.0681 9.3332 10.0681L8.09217 10.058Z" fill="white"></path>
</g>
</g>
<defs>
<clipPath id="clip0_2_20">
<rect width="108" height="40" fill="white"></rect>
</clipPath>
</defs>
</svg>

          </span>
  </a>
</div>

      </div>
    <div class="footer__right">
        <a class="footer__audio-link footer__audio-link-desktop" aria-label="Audio" href="https://edition.cnn.com/audio" data-zjs="click" data-zjs-component_id="https://edition.cnn.com/audio" data-zjs-component_text="Audio" data-zjs-component_type="link" data-zjs-container_id="cms.cnn.com/_components/footer/instances/business-v2@published" data-zjs-container_type="navigation" data-zjs-destination_url="https://edition.cnn.com/audio" data-zjs-page_type="article" data-zjs-page_variant="article_leaf" data-zjs-navigation-type="main" data-zjs-navigation-location="footer">
          Audio
        </a>
        <a class="footer__live-tv-link footer__live-tv-link-desktop" aria-label="Live TV" href="https://edition.cnn.com/live-tv" data-zjs="click" data-zjs-component_id="https://edition.cnn.com/live-tv" data-zjs-component_text="Live TV" data-zjs-component_type="link" data-zjs-container_id="cms.cnn.com/_components/footer/instances/business-v2@published" data-zjs-container_type="navigation" data-zjs-destination_url="https://edition.cnn.com/live-tv" data-zjs-page_type="article" data-zjs-page_variant="article_leaf" data-zjs-navigation-type="main" data-zjs-navigation-location="footer">
          Live TV
        </a>
        <div class="footer__vertical-divider footer__live-tv-link-desktop"></div>
          <div data-uri="cms.cnn.com/_components/social-links/instances/new-business-footer-v1@published" class="social-links" data-editable="settings">
      <span class="social-links__copy">Follow CNN Business</span>
  <ul class="social-links__items">
      <li class="social-links__item">
          <a class="social-links__link" href="https://facebook.com/cnnbusiness" target="_blank" rel="noopener noreferrer" title="Visit us on Facebook">
              <svg class="facebook-icon" aria-label="Facebook" width="64" height="64" viewBox="0 0 64 64" fill="" xmlns="https://www.w3.org/2000/svg" aria-hidden="true"><path d="M56,5.1H8c-1.6,0-3,1.4-3,3v48.8c0,1.7,1.3,3,3,3h25.9V38.7h-7v-8.3h7v-6.1 c0-7.1,4.3-10.9,10.5-10.9c3,0,5.9,0.2,6.7,0.3v7.7h-4.7c-3.4,0-4.1,1.6-4.1,4v5h8.1l-1,8.3h-7v21.2H56c1.6,0,3-1.4,3-3V8.1 C59,6.4,57.7,5.1,56,5.1"></path></svg>
          </a>
      </li>
      <li class="social-links__item">
          <a class="social-links__link" href="https://twitter.com/cnnbusiness" target="_blank" rel="noopener noreferrer" title="Visit us on Twitter">
              <svg class="twitter-icon" aria-label="Twitter" width="64" height="64" viewBox="0 0 64 64" fill="" xmlns="https://www.w3.org/2000/svg" aria-hidden="true"><path d="M60,15.2c-2.1,0.9-4.3,1.5-6.6,1.7c2.4-1.4,4.2-3.6,5.1-6.1c-2.2,1.3-4.7,2.2-7.3,2.7 c-2.1-2.2-5.1-3.5-8.4-3.5c-6.3,0-11.5,5-11.5,11.1c0,0.9,0.1,1.7,0.3,2.5C22,23.2,13.6,18.8,7.9,12c-1,1.6-1.6,3.5-1.6,5.6 c0,3.9,2,7.3,5.1,9.2c-1.9-0.1-3.7-0.6-5.2-1.4v0.1c0,5.4,4,9.9,9.2,10.9c-1,0.3-2,0.4-3,0.4c-0.7,0-1.5-0.1-2.2-0.2 c1.5,4.4,5.7,7.6,10.7,7.7c-3.9,3-8.9,4.8-14.3,4.8c-0.9,0-1.8-0.1-2.7-0.2c5.1,3.2,11.1,5,17.6,5c21.1,0,32.7-16.9,32.7-31.6 c0-0.5,0-1,0-1.4C56.5,19.4,58.5,17.4,60,15.2"></path></svg>
          </a>
      </li>
      <li class="social-links__item">
          <a class="social-links__link" href="https://youtube.com/user/CNN" target="_blank" rel="noopener noreferrer" title="Visit us on YouTube">
              <svg class="youtube-icon" width="64" aria-label="Youtube" height="64" viewBox="0 0 64 64" fill="" xmlns="https://www.w3.org/2000/svg" aria-hidden="true"><path d="M61.32,17.22A7.66,7.66,0,0,0,56,11.89c-4.77-1.28-24-1.28-24-1.28s-19.15,0-24,1.28a7.66,7.66,0,0,0-5.33,5.33A79.91,79.91,0,0,0,1.4,32,80.28,80.28,0,0,0,2.73,46.78,7.66,7.66,0,0,0,8.06,52.1c4.76,1.29,24,1.29,24,1.29s19.14,0,24-1.29a7.67,7.67,0,0,0,5.32-5.32A80.23,80.23,0,0,0,62.6,32,79.86,79.86,0,0,0,61.32,17.22Zm-35.42,24V22.84l16,9.19Z"></path></svg>
          </a>
      </li>
      <li class="social-links__item">
          <a class="social-links__link" href="https://instagram.com/cnnbusiness" target="_blank" rel="noopener noreferrer" title="Visit us on Instagram">
              <svg class="instagram-icon" aria-label="Instagram" width="64" height="64" viewBox="0 0 64 64" fill="" xmlns="https://www.w3.org/2000/svg" aria-hidden="true"><path d="M47,13.2c-1.9,0-3.5,1.6-3.5,3.6s1.6,3.6,3.5,3.6s3.5-1.6,3.5-3.6S49,13.2,47,13.2 L47,13.2z M31.9,23c-5.1,0-9.3,4.3-9.3,9.5s4.2,9.5,9.3,9.5s9.3-4.3,9.3-9.5S37,23,31.9,23L31.9,23z M31.9,46.7 c-7.7,0-14-6.4-14-14.2s6.3-14.2,14-14.2s14,6.4,14,14.2S39.6,46.7,31.9,46.7L31.9,46.7z M15.7,8.8c-3.9,0-7,3.2-7,7.1v33.2 c0,3.9,3.1,7.1,7,7.1h32.7c3.9,0,7-3.2,7-7.1V15.9c0-3.9-3.1-7.1-7-7.1C48.4,8.8,15.7,8.8,15.7,8.8z M48.3,60.9H15.7 C9.2,60.9,4,55.6,4,49.1V15.9C4,9.4,9.2,4.1,15.7,4.1h32.7C54.8,4.1,60,9.4,60,15.9v33.2C60,55.6,54.8,60.9,48.3,60.9L48.3,60.9z"></path></svg>
          </a>
      </li>
  </ul>
</div>

        <div id="headerAccountNavIcon" class="footer__user-account-nav-icon footer__user-account-nav-desktop">
          <nav class="user-account-nav user-account-nav--unauth" data-uri="cms.cnn.com/_components/user-account-nav/instances/user-account-nav@published" data-editable="settings" aria-label="User Account Nav" data-avatar-enabled="false" tabindex="0" style="visibility: visible;">
<div class="user-account-nav__icons">
  <button class="user-account-nav__icon-button user-account-nav__icon-button--auth userAccountButton" aria-haspopup="true" aria-expanded="false" aria-label="User Account Nav Button" data-zjs="click" data-zjs-component_id="user-account-nav__icon-button user-account-nav__icon-button--auth userAccountButton" data-zjs-component_text="User Account Nav Button" data-zjs-component_type="button" data-zjs-container_id="" data-zjs-container_type="navigation" data-zjs-destination_url="" data-zjs-page_type="article" data-zjs-page_variant="article_leaf" data-zjs-navigation-type="main" data-zjs-navigation-location="footer">
    <svg class="icon-ui-avatar-fill" width="24" height="24" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" aria-label="User Avatar" role="img"><path d="M18.975 17.15c-.088-.38-.227-.563-.231-.572-.537-1.055-2.583-2.014-5.736-2.194 2.284-.622 3.806-3.113 2.79-5.727a3.94 3.94 0 00-2.233-2.233c-3.013-1.171-5.879 1.034-5.879 3.896a4.22 4.22 0 003.126 4.068c-3.118.189-5.142 1.143-5.674 2.191-.014.023-.114.173-.193.458-1.453-2.03-2.058-4.706-1.274-7.51.762-2.723 2.854-4.92 5.551-5.767C15.18 1.892 20.674 6.316 20.674 12a8.628 8.628 0 01-1.7 5.15M9.135 2.4a9.753 9.753 0 00-6.74 6.759c-1.09 3.92.169 7.628 2.68 10.043v.002l.03.027c2.433 2.321 6.026 3.435 9.813 2.353a9.752 9.752 0 006.686-6.734A10.038 10.038 0 009.134 2.4"></path></svg>

    <span class="userAccountFollowDot"></span>
  </button>
  <button class="user-account-nav__icon-button user-account-nav__icon-button--unauth userAccountButton" aria-haspopup="true" aria-expanded="false" role="link" data-login-href="/account/log-in" aria-label="User Account Log In Button" data-zjs="click" data-zjs-component_id="/account/log-in" data-zjs-component_text="User Account Log In Button" data-zjs-component_type="button" data-zjs-container_id="" data-zjs-container_type="navigation" data-zjs-destination_url="/account/log-in" data-zjs-page_type="article" data-zjs-page_variant="article_leaf" data-zjs-navigation-type="main" data-zjs-navigation-location="footer">
    <svg class="icon-ui-avatar-default" width="24" height="24" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" aria-label="User Avatar" role="img"><path d="M12 20.674a8.654 8.654 0 01-6.483-2.92c.168-.397.523-.758 1.067-1.076 1.334-.782 3.268-1.23 5.305-1.23 2.027 0 3.955.445 5.288 1.22.628.365.998.787 1.125 1.283A8.649 8.649 0 0112 20.674m1.521-7.203c-3.033 1.496-6.04-1.51-4.544-4.543a2.831 2.831 0 011.282-1.282c3.032-1.491 6.035 1.512 4.543 4.543a2.833 2.833 0 01-1.28 1.282m1.69-9.564c2.334.85 4.161 2.752 4.958 5.106.974 2.873.47 5.65-.941 7.773-.307-.486-.765-.912-1.382-1.27-.912-.53-2.054-.922-3.303-1.155a4.642 4.642 0 001.89-4.755 4.567 4.567 0 00-3.745-3.62 4.648 4.648 0 00-5.442 4.574c0 1.571.787 2.96 1.986 3.8-1.258.235-2.407.63-3.323 1.167-.536.314-.953.674-1.256 1.076A8.617 8.617 0 013.326 12c0-5.821 5.765-10.322 11.885-8.093m.112-1.368A10.052 10.052 0 002.539 15.321a9.611 9.611 0 006.138 6.14A10.052 10.052 0 0021.461 8.679a9.611 9.611 0 00-6.138-6.14"></path></svg>

  </button>
    <button class="user-account-nav__text-button user-account-nav__text-button--unauth userAccountButton" aria-haspopup="true" aria-expanded="false" role="link" aria-label="User Account Log In Button" data-login-href="/account/log-in" data-zjs="click" data-zjs-component_id="/account/log-in" data-zjs-component_text="User Account Log In Button" data-zjs-component_type="button" data-zjs-container_id="" data-zjs-container_type="navigation" data-zjs-destination_url="/account/log-in" data-zjs-page_type="article" data-zjs-page_variant="article_leaf" data-zjs-navigation-type="main" data-zjs-navigation-location="footer">
      Log In
    </button>
</div>
<div class="user-account-nav__menu userAccountNavMenu" aria-label="User Account Nav Menu">
  <div class="user-account-nav__menu-button userAccountNavMenuButton" aria-haspopup="true" aria-expanded="false" data-zjs="click" data-zjs-component_id="user-account-nav__menu-button userAccountNavMenuButton" data-zjs-component_text="My Account" data-zjs-component_type="button" data-zjs-container_id="" data-zjs-container_type="navigation" data-zjs-destination_url="" data-zjs-page_type="article" data-zjs-page_variant="article_leaf" data-zjs-navigation-type="main" data-zjs-navigation-location="footer">
    My Account<span aria-hidden="true"><svg class="icon-ui-caret-down" width="24" height="24" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="M12.478 17.218a.637.637 0 01-.946 0L2.206 7.2c-.225-.242-.28-.632-.093-.91a.613.613 0 01.975-.088l8.917 9.579 8.878-9.538c.225-.242.589-.3.847-.1.33.255.357.752.082 1.048l-9.334 10.027z"></path></svg>
</span>
  </div>
  <ul class="user-account-nav__menu-options userAccountNavOptions" role="menu" tabindex="0">
    <li class="user-account-nav__menu-item">
     <a class="user-account-nav__menu-link" data-name="settings" href="/account/settings" data-zjs="click" data-zjs-component_id="cms.cnn.com/_components/user-account-nav/instances/user-account-nav@published" data-zjs-component_text="Settings" data-zjs-component_type="link" data-zjs-container_id="" data-zjs-container_type="navigation" data-zjs-destination_url="/account/settings" data-zjs-page_type="article" data-zjs-page_variant="article_leaf" data-zjs-navigation-type="main" data-zjs-navigation-location="footer">
        Settings
      </a>
    </li>
    <li class="user-account-nav__menu-item">
     <a class="user-account-nav__menu-link user-account-nav__menu-link--hide" data-name="follow" href="/account/my-news?iid=fw_var-nav" data-zjs="click" data-zjs-component_id="cms.cnn.com/_components/user-account-nav/instances/user-account-nav@published" data-zjs-component_text="Topics You Follow" data-zjs-component_type="link" data-zjs-container_id="" data-zjs-container_type="navigation" data-zjs-destination_url="/account/my-news?iid=fw_var-nav" data-zjs-page_type="article" data-zjs-page_variant="article_leaf" data-zjs-navigation-type="main" data-zjs-navigation-location="footer">
        Topics You Follow
        <span class="user-account-nav__menu-notification-dot"></span>
      </a>
    </li>
    <li class="user-account-nav__menu-item">
     <a class="user-account-nav__menu-link" data-name="logout" href="#" data-zjs="click" data-zjs-component_id="cms.cnn.com/_components/user-account-nav/instances/user-account-nav@published" data-zjs-component_text="Log Out" data-zjs-component_type="link" data-zjs-container_id="" data-zjs-container_type="navigation" data-zjs-destination_url="#" data-zjs-page_type="article" data-zjs-page_variant="article_leaf" data-zjs-navigation-type="main" data-zjs-navigation-location="footer">
        Log Out
      </a>
    </li>
  </ul>
</div>
<div class="user-account-nav__user">
  <span class="user-account-nav__user__text user-account-nav__user__text--auth">Your CNN account</span>
  <span class="user-account-nav__user__text user-account-nav__user__text--unauth">Log in to your CNN account</span>
</div>
<a class="user-account-nav__override-link" href="/account/log-in" data-zjs="click" data-zjs-component_id="user-account-nav__override-link" data-zjs-component_text="" data-zjs-component_type="link" data-zjs-container_id="" data-zjs-container_type="navigation" data-zjs-destination_url="#" data-zjs-page_type="article" data-zjs-page_variant="article_leaf" data-zjs-navigation-type="main" data-zjs-navigation-location="footer"></a>
</nav>

        </div>
    </div>
  </div>
    <hr class="footer__divider">
    <p class="footer__disclaimer-text" data-editable="disclaimerText">Most stock quote data provided by BATS. US market indices are shown in real time, except for the S&amp;P 500 which is refreshed every two minutes. All times are ET. Factset: FactSet Research Systems Inc. All rights reserved. Chicago Mercantile: Certain market data is the property of Chicago Mercantile Exchange Inc. and its licensors. All rights reserved. Dow Jones: The Dow Jones branded indices are proprietary to and are calculated, distributed and marketed by DJI Opco, a subsidiary of S&amp;P Dow Jones Indices LLC and have been licensed for use to S&amp;P Opco, LLC and CNN. Standard &amp; Poor’s and S&amp;P are registered trademarks of Standard &amp; Poor’s Financial Services LLC and Dow Jones is a registered trademark of Dow Jones Trademark Holdings LLC. All content of the Dow Jones branded indices Copyright S&amp;P Dow Jones Indices LLC and/or its affiliates. Fair value provided by IndexArb.com. Market holidays and trading hours provided by Copp Clark Limited.</p>
  <nav class="footer__links" data-editable="footerLinks">
      <a href="https://edition.cnn.com/terms" class="footer__link">
        Terms of Use
      </a>
      <a href="https://edition.cnn.com/privacy" class="footer__link">
        Privacy Policy
      </a>
      <a href="#" class="uclink footer__link" style="display: block; text-align: center;">Cookie Settings</a>
      <a href="https://warnermediaprivacy.com/policycenter/b2c/WMNS" target="_blank" class="footer__link">
        Ad Choices
      </a>
      <a href="https://edition.cnn.com/accessibility" class="footer__link">
        Accessibility &amp; CC
      </a>
      <a href="https://edition.cnn.com/about" class="footer__link">
        About
      </a>
      <a href="https://edition.cnn.com/newsletters" class="footer__link">
        Newsletters
      </a>
      <a href="https://edition.cnn.com/transcripts" class="footer__link">
        Transcripts
      </a>
  </nav>
  <p class="footer__copyright-text" data-editable="copyrightText">© 2023 Cable News Network. A Warner Bros. Discovery Company. All Rights Reserved. <br> CNN Sans ™ &amp; © 2016 Cable News Network.</p>
</div>
</footer>

      </div>
</div>

</div>

</div>
  </div>`);

    // Remove elements that are likely part of the navbar, menu, or sidebar
    $(
      '[class*="navbar"], [class*="nav"], [class*="menu"], [class*="header"], [class*="sidebar"], [class*="aside"]'
    ).remove();

    // Extract main content
    const allText = [];

    $(`.${targetClass}`).each((_, element) => {
      const text = extractTextFromElement($, element);
      allText.push(text);
    });

    // If no elements found with the class, then use the ID
    if (allText.length === 0) {
      $(`#${targetId}`).each((_, element) => {
        const text = extractTextFromElement($, element);
        allText.push(text);
      });
    }

    return allText;
  } catch (error) {
    console.error("Error fetching the webpage:", error);
  }
};
