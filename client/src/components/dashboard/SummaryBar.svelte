<script>
    export let totalBids;
    export let totalPayment;
    export let userEmail;
</script>

<div class="summary-bar">
    <p><strong>Total Bids:</strong> {totalBids}</p>
    <p><strong>Total Payment:</strong> ${totalPayment}</p>
    <p><strong>Email:</strong> {userEmail}</p>
</div>

<style>
    .summary-bar {
        display: flex;
        justify-content: space-between;
        padding: 1rem;
        background-color: #f4f4f4;
        border-radius: 8px;
        margin-bottom: 1rem;
    }
</style>
