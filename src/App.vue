<template>
  <div class="toilet-card">
    <div class="header">
      <h2>公共厕所3</h2>
      <div class="rating">{{ rating }}分</div>
    </div>

    <div class="id-location">
      <div class="id">SH-JD-0064</div>
      <div class="location">
        <font-awesome-icon icon="location-dot" />
        人民街（夹弄）13号西侧
      </div>
    </div>

    <div class="section-title">内部设施</div>
    <div class="facilities">
      <div class="facility-item">
        <font-awesome-icon icon="restroom" />
        <span>男厕所</span>
        <span class="count">5</span>
      </div>
      <div class="facility-item">
        <font-awesome-icon icon="restroom" />
        <span>女厕所</span>
        <span class="count">5</span>
      </div>
      <div class="facility-item">
        <font-awesome-icon icon="wheelchair" />
        <span>无障碍厕位</span>
        <span class="count">0</span>
      </div>
      <div class="facility-item">
        <font-awesome-icon icon="toilet" />
        <span>第三卫生间</span>
        <span class="count">0</span>
      </div>
    </div>

    <div class="section-title">基础信息</div>
    <div class="basic-info">
      <div class="info-row">
        <span class="label">业主信息</span>
        <span class="value">南翔景区</span>
      </div>
      <div class="info-row">
        <span class="label">厕所面积</span>
        <span class="value">40 m²</span>
      </div>
      <div class="info-row">
        <span class="label">建设性质</span>
        <span class="value">新建</span>
      </div>
      <div class="info-row">
        <span class="label">拟建等级</span>
        <span class="value">AAA级</span>
      </div>
      <div class="info-row">
        <span class="label">完工日期</span>
        <span class="value">2023年12月</span>
      </div>
      <div class="info-row">
        <span class="label">新技术采用</span>
        <span class="value">节水节能技术</span>
      </div>
    </div>

    <div class="section-title reviews-title">
      <div class="title-with-count">
        <span>用户点评</span>
        <span class="review-count">({{ reviews.length }})</span>
      </div>
      <button class="write-review" @click="showReviewForm = true">
        <font-awesome-icon icon="pencil" />
        写点评
      </button>
    </div>

    <div class="reviews-list">
      <div v-for="(review, index) in reviews" :key="index" class="review-item">
        <div class="review-header">
          <div class="review-rating">
            <span v-for="n in 5" :key="n" class="star" :class="{ active: n <= review.rating }">
              ★
            </span>
          </div>
          <div class="review-date">{{ review.date }}</div>
        </div>
        <div class="review-tags">
          <span v-for="tag in review.tags" :key="tag" class="review-tag">{{ tag }}</span>
        </div>
        <div class="review-content">{{ review.content }}</div>
        <div v-if="review.needsRepair" class="repair-flag">
          <font-awesome-icon icon="wrench" />
          <span>设施需要维修</span>
        </div>
      </div>
    </div>

    <!-- 点评表单弹窗 -->
    <div v-if="showReviewForm" class="review-form-overlay">
      <div class="review-form">
        <template v-if="!showSuccess">
          <div class="review-form-header">
            <h3>写点评</h3>
            <button class="close-button" @click="showReviewForm = false">&times;</button>
          </div>

          <div class="rating-section">
            <div class="rating-title">总体评分</div>
            <div class="stars">
              <span
                v-for="n in 5"
                :key="n"
                class="star"
                :class="{ active: n <= userRating }"
                @click="userRating = n"
              >
                ★
              </span>
            </div>
          </div>

          <div class="tag-section">
            <div class="rating-title">选择标签</div>
            <div class="tag-options">
              <span
                v-for="tag in allTags"
                :key="tag"
                class="tag"
                :class="{ selected: selectedTags.includes(tag) }"
                @click="toggleTag(tag)"
              >
                {{ tag }}
              </span>
            </div>
          </div>

          <div class="comment-section">
            <div class="rating-title">评价内容</div>
            <textarea
              v-model="reviewContent"
              rows="4"
              placeholder="请分享您的使用体验..."
            ></textarea>
          </div>

          <div class="repair-option">
            <label class="repair-checkbox">
              <input type="checkbox" v-model="needsRepair">
              <span class="checkbox-text">设施需要维修</span>
            </label>
          </div>

          <div class="form-actions">
            <button class="cancel-button" @click="showReviewForm = false">取消</button>
            <button
              class="submit-button"
              :disabled="!canSubmit"
              @click="submitReview"
            >
              提交
            </button>
          </div>
        </template>
        <SubmitSuccess v-else />
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import SubmitSuccess from './components/SubmitSuccess.vue'
import reviewsData from './data/reviews.json'

const rating = ref(4.7)
const allTags = ref(['环境整洁', '服务到位', '没有异味', '卫生干净', '位置好找'])

const showReviewForm = ref(false)
const userRating = ref(0)
const selectedTags = ref([])
const reviewContent = ref('')
const needsRepair = ref(false)
const showSuccess = ref(false)

const toggleTag = (tag) => {
  const index = selectedTags.value.indexOf(tag)
  if (index === -1) {
    selectedTags.value.push(tag)
  } else {
    selectedTags.value.splice(index, 1)
  }
}

const canSubmit = computed(() => {
  return userRating.value > 0 && reviewContent.value.trim().length > 0
})

const reviews = ref([])

onMounted(async () => {
  try {
    const response = await fetch('http://localhost:3000/api/reviews')
    if (!response.ok) {
      throw new Error('获取评论失败')
    }
    const data = await response.json()
    reviews.value = data
    rating.value = calculateAverageRating()
  } catch (error) {
    console.error('获取评论失败:', error)
  }
})

const calculateAverageRating = () => {
  if (reviews.value.length === 0) return 0
  const sum = reviews.value.reduce((acc, review) => acc + review.rating, 0)
  return (sum / reviews.value.length).toFixed(1)
}

const submitReview = async () => {
  const newReview = {
    rating: userRating.value,
    date: new Date().toISOString().split('T')[0],
    tags: selectedTags.value,
    content: reviewContent.value,
    needsRepair: needsRepair.value
  }
  reviews.value.unshift(newReview)
  // 更新总体评分
  rating.value = calculateAverageRating()
  
  // 保存到本地文件
  try {
    const response = await fetch('http://localhost:3000/api/reviews', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(reviews.value)
    })
    if (!response.ok) {
      throw new Error('保存评论失败')
    }
  } catch (error) {
    console.error('保存评论失败:', error)
  }

  showSuccess.value = true
  setTimeout(() => {
    showSuccess.value = false
    showReviewForm.value = false
    // 重置表单
    userRating.value = 0
    selectedTags.value = []
    reviewContent.value = ''
    needsRepair.value = false
  }, 2000)
}
</script>

<style>
body {
  margin: 0;
  padding: 0;
  background-color: #f5f5f5;
}

.toilet-card {
  max-width: 800px;
  margin: 20px auto;
  padding: 20px;
  background: white;
  border-radius: 8px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
}

.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 15px;
}

.header h2 {
  margin: 0;
  font-size: 20px;
  font-weight: 500;
}

.rating {
  color: #ff6b00;
  font-size: 18px;
  font-weight: 500;
}

.id-location {
  margin-bottom: 20px;
}

.id {
  color: #666;
  font-size: 14px;
  margin-bottom: 8px;
}

.location {
  display: flex;
  align-items: center;
  gap: 5px;
  color: #333;
  font-size: 14px;
}

.section-title {
  font-size: 16px;
  font-weight: 500;
  color: #333;
  margin: 20px 0 15px;
  position: relative;
}

.section-title::after {
  content: '';
  position: absolute;
  left: 0;
  bottom: -5px;
  width: 30px;
  height: 2px;
  background: #ff6b00;
}

.facilities {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 15px;
}

.facility-item {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 14px;
  padding: 10px;
  background: #f5f5f5;
  border-radius: 4px;
}

.facility-item svg {
  color: #1890ff;
}

.count {
  margin-left: auto;
  color: #666;
}

.basic-info {
  background: #f5f5f5;
  border-radius: 8px;
  padding: 15px;
  display: flex;
  justify-content: space-between;
}

.info-row {
  display: flex;
  flex-direction: column;
  align-items: center;
  font-size: 14px;
  flex: 1;
  position: relative;
}

.info-row:not(:last-child)::after {
  content: '';
  position: absolute;
  right: 0;
  top: 50%;
  transform: translateY(-50%);
  width: 1px;
  height: 70%;
  background-color: #ddd;
}

.info-row .label {
  color: #666;
  margin-bottom: 8px;
}

.value {
  color: #333;
}

.info-row:last-child {
  margin-bottom: 0;
}

.info-row .label {
  color: #666;
}

.value {
  color: #333;
}

.reviews-title {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.write-review {
  background-color: #1890ff;
  color: white;
  border: none;
  padding: 8px 16px;
  border-radius: 4px;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 14px;
}

.write-review:hover {
  background-color: #40a9ff;
}

.review-form-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
}

.review-form {
  background: white;
  padding: 24px;
  border-radius: 8px;
  width: 90%;
  max-width: 500px;
  max-height: 90vh;
  overflow-y: auto;
}

.review-form-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.close-button {
  background: none;
  border: none;
  font-size: 24px;
  cursor: pointer;
  color: #999;
}

.rating-section,
.tag-section,
.comment-section {
  margin-bottom: 20px;
}

.rating-title {
  margin-bottom: 10px;
  font-weight: 500;
}

.stars {
  display: flex;
  gap: 8px;
}

.star {
  font-size: 24px;
  cursor: pointer;
  color: #d9d9d9;
}

.star.active {
  color: #ffd700;
}

.tag-options {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.tag {
  padding: 6px 12px;
  border: 1px solid #d9d9d9;
  border-radius: 16px;
  cursor: pointer;
}

.tag.selected {
  background-color: #e6f7ff;
  border-color: #1890ff;
  color: #1890ff;
}

textarea {
  width: 100%;
  padding: 8px;
  border: 1px solid #d9d9d9;
  border-radius: 4px;
  resize: vertical;
}

.repair-option {
  margin-bottom: 20px;
}

.repair-checkbox {
  display: flex;
  align-items: center;
  gap: 8px;
  cursor: pointer;
}

.form-actions {
  display: flex;
  justify-content: flex-end;
  gap: 12px;
}

.cancel-button,
.submit-button {
  padding: 8px 16px;
  border-radius: 4px;
  cursor: pointer;
}

.cancel-button {
  background: none;
  border: 1px solid #d9d9d9;
}

.submit-button {
  background-color: #1890ff;
  color: white;
  border: none;
}

.submit-button:disabled {
  background-color: #d9d9d9;
  cursor: not-allowed;
}

.reviews-list {
  margin-top: 15px;
}

.review-item {
  background: #fff;
  border: 1px solid #e8e8e8;
  border-radius: 8px;
  padding: 16px;
  margin-bottom: 16px;
}

.review-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 12px;
}

.review-rating .star {
  font-size: 16px;
  color: #d9d9d9;
}

.review-rating .star.active {
  color: #ffd700;
}

.review-date {
  color: #999;
  font-size: 14px;
}

.review-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin-bottom: 12px;
}

.review-tag {
  background-color: #e6f7ff;
  color: #1890ff;
  padding: 4px 12px;
  border-radius: 12px;
  font-size: 12px;
}

.review-content {
  color: #333;
  line-height: 1.5;
  margin-bottom: 12px;
}

.repair-flag {
  display: flex;
  align-items: center;
  gap: 6px;
  color: #ff4d4f;
  font-size: 14px;
}
</style>

.title-with-count {
  display: flex;
  align-items: center;
  gap: 8px;
}

.review-count {
  color: #999;
  font-size: 14px;
}