<script>
    export let totalBids;
    export let totalPayment;
    export let userEmail;
</script>

<div class="flex justify-between items-center bg-gray-100 p-4 rounded-lg shadow-md">
    <p class="text-sm text-gray-700"><strong>Total Bids:</strong> {totalBids}</p>
    <p class="text-sm text-gray-700"><strong>Total Payment:</strong> ${totalPayment}</p>
    <p class="text-sm text-gray-700"><strong>Email:</strong> {userEmail}</p>
</div>
