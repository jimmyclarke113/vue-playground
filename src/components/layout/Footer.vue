<template>
    <footer class="footer">
        <div class="footer-content">
            <p>&copy; 2024 My App. All rights reserved.</p>
            <nav class="footer-links">
                <a href="#privacy">Privacy Policy</a>
                <a href="#terms">Terms of Service</a>
                <a href="#contact">Contact</a>
            </nav>
        </div>
    </footer>
</template>

<script>
export default {
    name: 'Footer'
}
</script>

<style scoped>
.footer {
    background-color: #262626;
    color: #fff;
    padding: 2rem;
    text-align: center;
    margin-top: auto;
}

.footer-content {
    max-width: 1200px;
    margin: 0 auto;
}

.footer-links {
    margin-top: 1rem;
}

.footer-links a {
    color: #fff;
    text-decoration: none;
    margin: 0 1rem;
    font-size: 0.9rem;
}

.footer-links a:hover {
    text-decoration: underline;
}
</style>