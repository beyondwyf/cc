<template>
  <div class="submit-success">
    <div class="success-icon">
      <svg class="checkmark" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 52 52">
        <circle class="checkmark-circle" cx="26" cy="26" r="25" fill="none"/>
        <path class="checkmark-check" fill="none" d="M14.1 27.2l7.1 7.2 16.7-16.8"/>
      </svg>
    </div>
    <h2 class="success-title">评论成功</h2>
    <p class="success-subtitle">感谢您的评论</p>
    <p class="success-description">您的每一条评论我们都会反馈到当地主管部门</p>
  </div>
</template>

<script setup>
// 组件逻辑
</script>

<style scoped>
.submit-success {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 40px 20px;
  text-align: center;
  background: white;
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  animation: fadeIn 0.3s ease-out;
  z-index: 1001;
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translate(-50%, -60%);
  }
  to {
    opacity: 1;
    transform: translate(-50%, -50%);
  }
}

.success-icon {
  width: 60px;
  height: 60px;
  margin-bottom: 16px;
}

.checkmark {
  width: 100%;
  height: 100%;
  border-radius: 50%;
  display: block;
  stroke-width: 2;
  stroke: #1890ff;
  stroke-miterlimit: 10;
  animation: fill .4s ease-in-out .4s forwards, scale .3s ease-in-out .9s both;
}

.checkmark-circle {
  stroke-dasharray: 166;
  stroke-dashoffset: 166;
  stroke-width: 2;
  stroke-miterlimit: 10;
  stroke: #1890ff;
  fill: none;
  animation: stroke 0.6s cubic-bezier(0.65, 0, 0.45, 1) forwards;
}

.checkmark-check {
  transform-origin: 50% 50%;
  stroke-dasharray: 30;
  stroke-dashoffset: 30;
  animation: stroke 0.3s cubic-bezier(0.65, 0, 0.45, 1) 0.6s forwards;
}

@keyframes stroke {
  100% {
    stroke-dashoffset: 0;
  }
}

@keyframes scale {
  0%, 100% {
    transform: none;
  }
  50% {
    transform: scale3d(1.1, 1.1, 1);
  }
}

@keyframes fill {
  100% {
    box-shadow: inset 0px 0px 0px 30px #1890ff;
  }
}

.success-title {
  font-size: 20px;
  color: #1890ff;
  margin: 0 0 8px;
  font-weight: 500;
}

.success-subtitle {
  font-size: 16px;
  color: #333;
  margin: 0 0 4px;
}

.success-description {
  font-size: 14px;
  color: #666;
  margin: 0;
  line-height: 1.5;
}
</style>