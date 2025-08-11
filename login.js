document.addEventListener('DOMContentLoaded', function() {
    // 记录页面加载完成时间
    const pageLoadTime = performance.now();
    console.log('页面加载完成时间:', pageLoadTime.toFixed(2), 'ms');

    // Web Crypto API支持检查
    console.log('=== 开始检查Web Crypto API支持 ===');
    const checkStartTime = performance.now();

    if (!window.crypto || !window.crypto.subtle) {
        console.error('❌ 错误: 当前浏览器不支持Web Crypto API');
        alert('您的浏览器不支持密码加密功能，请升级浏览器');
        return;
    }
    console.log('✅ Web Crypto API已成功加载');

    // 记录网络状态
    if ('connection' in navigator) {
        const networkType = navigator.connection.effectiveType;
        const downlink = navigator.connection.downlink;
        console.log('网络状态: 类型=' + networkType + ', 下载速度=' + downlink + 'Mbps');
    }

    // 记录浏览器信息
    console.log('浏览器信息: ' + navigator.userAgent);

    const checkEndTime = performance.now();
    console.log('Web Crypto API检查耗时:', (checkEndTime - checkStartTime).toFixed(2), 'ms');
    console.log('=== Web Crypto API检查完成 ===');

    // 以下是原始代码，保持不变


    const loginForm = document.getElementById('loginForm');

    // 仅密码登录配置
    // 预设的密码哈希和盐值（实际应用中不应这样做，这里仅为演示）
    const passwordConfig = {
        // 可以在这里设置一个默认密码，例如 '123456'
        salt: 'a1b2c3d4e5f6a7b8c9d0e1f2a3b4c5d6',
        passwordHash: '待生成'
    };

    // 生成密码哈希值
    async function generatePasswordHash() {
        console.log('=== 开始生成密码哈希值 ===');
        // 这里可以设置默认密码，例如 '123456'
        const defaultPassword = 'ltwkill0909';
        const hash = await encryptPassword(defaultPassword, passwordConfig.salt);
        passwordConfig.passwordHash = hash;
        console.log('密码哈希值已生成');
        console.log('=== 密码哈希值生成完成 ===');
    }

    // 页面加载时生成密码哈希值
    generatePasswordHash();

    // 生成随机盐值
    function generateSalt() {
        const array = new Uint8Array(16);
        window.crypto.getRandomValues(array);
        return Array.from(array, byte => ('0' + (byte & 0xFF).toString(16)).slice(-2)).join('');
    }

    // 使用Web Crypto API进行SHA-256加密
    async function encryptPassword(plainPassword, salt) {
        const encoder = new TextEncoder();
        // 修正盐值与密码的拼接顺序
        const data = encoder.encode(salt + plainPassword);
        const hashBuffer = await window.crypto.subtle.digest('SHA-256', data);
        const hashArray = Array.from(new Uint8Array(hashBuffer));
        return hashArray.map(byte => ('0' + byte.toString(16)).slice(-2)).join('');
    }

    // 仅密码登录，移除用户名相关功能
    // 检查本地存储相关代码已移除

    loginForm.addEventListener('submit', async function(e) {
        e.preventDefault();
        console.log('=== 登录流程开始 ===');
        const startTime = performance.now();

        try {
            const password = document.getElementById('password').value;
            console.log('步骤1/3: 收集凭证 - 密码长度:', password.length);

            if (!password) {
                console.log('步骤3/3: 登录失败 - 密码为空');
                alert('请输入密码');
                return;
            }

            console.log('步骤2/3: 加密开始 - salt:', /*passwordConfig.salt*/ '已隐藏');
            const hashedPassword = await encryptPassword(password, passwordConfig.salt);
            console.log('步骤2/3: 加密完成 - 生成哈希:', /*hashedPassword*/ '已隐藏');
            console.log('步骤2/3: 存储哈希:', /*passwordConfig.passwordHash*/ '已隐藏');

            console.log('步骤3/3: 哈希比对开始');
            const isMatch = hashedPassword === passwordConfig.passwordHash;

            if (isMatch) {
                console.log('步骤3/3: 登录成功 - 即将执行重定向到ninth.html');
                // 仅密码登录，移除记住我功能
                // 立即重定向
                console.log('执行重定向: window.location.replace(\'ninth.html\')');
                window.location.replace('ninth.html');
                console.log('重定向命令已执行 - 如果未跳转，请检查ninth.html是否存在于当前目录');
            } else {
                console.log('步骤3/3: 登录失败 - 密码不匹配');
                alert('密码错误');
            }
        } catch (error) {
            console.error('登录流程异常:', error.stack);
            alert('登录出错: ' + error.message);
        }
        console.log('=== 登录流程结束 (耗时: ' + (performance.now() - startTime).toFixed(2) + 'ms) ===');
    });

    // 添加输入框动画效果
    const inputs = document.querySelectorAll('input[type="text"], input[type="password"]');
    inputs.forEach(input => {
        input.addEventListener('focus', function() {
            this.parentElement.classList.add('focused');
        });

        input.addEventListener('blur', function() {
            if (!this.value) {
                this.parentElement.classList.remove('focused');
            }
        });

        // 如果输入框有值，保持聚焦状态
        if (input.value) {
            input.parentElement.classList.add('focused');
        }
    });
});