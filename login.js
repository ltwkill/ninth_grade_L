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

    // 存储在JS文件中的用户数据（实际应用中不应这样做，这里仅为演示）
    // 注意：这里的密码已经使用SHA-256 + 盐值加密
    // 更新用户哈希值以匹配salt+password的加密顺序
    const users = [
        { username: 'admin', password: '待生成', salt: 'a1b2c3d4e5f6a7b8c9d0e1f2a3b4c5d6' }, // 密码: zxcvbnm12345
        { username: 'user1', password: '待生成', salt: 'b2c3d4e5f6a7b8c9d0e1f2a3b4c5d6e7' }, // 密码: 123456
        { username: 'test', password: '待生成', salt: 'c3d4e5f6a7b8c9d0e1f2a3b4c5d6e7f8' }  // 密码: test123
    ];

    // 添加哈希值生成和验证函数
    async function validateAndGenerateHashes() {
        console.log('=== 开始验证和生成哈希值 ===');
        for (const user of users) {
            let password;
            switch(user.username) {
                case 'admin': password = 'zxcvbnm12345'; break;
                case 'user1': password = '123456'; break;
                case 'test': password = 'test123'; break;
                default: password = '';
            }
            if (password) {
                const hash = await encryptPassword(password, user.salt);
                console.log(`用户 ${user.username} 的正确哈希值:`, /*hash*/ '已隐藏');
                user.password = hash; // 更新为正确的哈希值
            }
        }
        console.log('=== 哈希值验证和生成完成 ===');
    }

    // 页面加载时生成正确的哈希值
    validateAndGenerateHashes();

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

    // 检查本地存储中是否有保存的用户名
    const savedUsername = localStorage.getItem('rememberedUsername');
    if (savedUsername) {
        document.getElementById('username').value = savedUsername;
        document.getElementById('rememberMe').checked = true;
    }

    loginForm.addEventListener('submit', async function(e) {
        e.preventDefault();
        console.log('=== 登录流程开始 ===');
        const startTime = performance.now();

        try {
            const username = document.getElementById('username').value;
            const password = document.getElementById('password').value;
            const rememberMe = document.getElementById('rememberMe').checked;
            console.log('步骤1/5: 收集凭证 - 用户名:', username, '密码长度:', password.length);

            if (!username || !password) {
                console.log('步骤5/5: 登录失败 - 用户名或密码为空');
                alert('请输入用户名和密码');
                return;
            }

            const user = users.find(u => u.username === username);
            console.log('步骤2/5: 用户查找 -', user ? `找到用户: ${user.username}` : '用户不存在');

            if (!user) {
                console.log('步骤5/5: 登录失败 - 用户不存在');
                alert('用户名或密码错误');
                return;
            }

            console.log('步骤3/5: 加密开始 - salt:', /*user.salt*/ '已隐藏');
            const hashedPassword = await encryptPassword(password, user.salt);
            console.log('步骤3/5: 加密完成 - 生成哈希:', /*hashedPassword*/ '已隐藏');
            console.log('步骤3/5: 存储哈希:', /*user.password*/ '已隐藏');

            console.log('步骤4/5: 哈希比对开始');
            const isMatch = hashedPassword === user.password;
            console.log('步骤4/5: 比对结果 -', isMatch ? '成功' : '失败');

            if (isMatch) {
                console.log('步骤5/5: 登录成功 - 即将执行重定向到ninth.html');
                // 恢复记住我功能
                if (rememberMe) {
                    localStorage.setItem('rememberedUsername', username);
                    console.log('记住我功能: 已保存用户名到本地存储');
                } else {
                    localStorage.removeItem('rememberedUsername');
                    console.log('记住我功能: 未勾选，已清除本地存储');
                }
                // 立即重定向
                console.log('执行重定向: window.location.href = \'ninth.html\'');
                window.location.href = '';
                console.log('重定向命令已执行 - 如果未跳转，请检查ninth.html是否存在于当前目录');
            } else {
                console.log('步骤5/5: 登录失败 - 密码不匹配');
                alert('用户名或密码错误');
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