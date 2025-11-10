import Image from 'next/image';
import styles from './gioi-thieu-GTN.module.scss';

const GioiThieu = () => {
    return (
        <div className={styles.aboutPage}>
            {/* Giới thiệu */}
            <section className={styles.aboutContainer}>
                <div className={styles.leftSection}>
                    <h2 className={styles.title}>Giới thiệu về GTN</h2>
                    <div className={styles.introText}>
                        <p>
                            GearVN là thương hiệu được sinh ra từ giấc mơ của một game thủ, phát triển bởi tập thể các
                            game thủ đam mê để phục vụ cho cộng đồng game thủ Việt.
                        </p>
                        <p>
                            Đội ngũ tư vấn của GTN không đơn thuần là nhân viên kinh doanh, chúng tôi còn là những
                            người yêu game với mong muốn giúp bạn sở hữu dàn máy và gear phù hợp.
                        </p>
                        <p>
                            Sự hài lòng của khách hàng chính là động lực giúp GTN không ngừng hoàn thiện, mang lại
                            ngày càng nhiều giá trị tích cực cho cộng đồng.
                        </p>
                    </div>

                    <div className={styles.quoteBox}>
                        <span className={styles.quoteIcon}>❝</span>
                        <p>
                            Khách hàng hôm nay là đồng đội tương lai! Chúng ta cùng nhau lan tỏa giá trị tích cực đến
                            cộng đồng game thủ và tất cả những người yêu công nghệ tại Việt Nam.
                        </p>
                        <span className={`${styles.quoteIcon} ${styles.right}`}>❞</span>
                    </div>
                </div>

                <div className={styles.rightSection}>
                    <Image src="/image/person.jpg" alt="Founder" width={400} height={400} className={styles.founderImage} />
                    <h3>Mr. Nguyễn Văn A</h3>
                    <p className={styles.position}>GTN Founder</p>
                </div>
            </section>

            {/* Showroom + Online shop */}
            <section className={styles.showroomSystemContainer}>
                <h2 className={styles.title}>Trải nghiệm mua sắm toàn diện</h2>

                <div className={styles.content}>
                    {/* Bên trái: Showroom */}
                    <div className={styles.leftSection}>
                        <Image src="/image/mapVN.png" alt="Showroom map" width={400} height={300} className={styles.mapImage} />
                        <h3>Hệ thống Showroom trải nghiệm</h3>

                        <div className={styles.region}>
                            <h4>Khu vực Miền Bắc</h4>
                            <ul>
                                <li>Showroom GTN Thái Hà</li>
                            </ul>
                        </div>

                        <div className={styles.region}>
                            <h4>Khu vực Miền Nam</h4>
                            <ul>
                                <li>Showroom GearVN Hoàng Hoa Thám</li>
                                <li>Showroom GearVN Kha Vạn Cân</li>
                                <li>Showroom GearVN Trần Hưng Đạo</li>
                            </ul>
                        </div>

                        <button className={styles.showroomButton}>XEM NGAY VỊ TRÍ SHOWROOM GẦN BẠN</button>
                    </div>

                    {/* Bên phải: Mua sắm online */}
                    <div className={styles.rightSection}>
                        <Image
                            src="/image/online.png"
                            alt="Online shopping"
                            width={400}
                            height={300}
                            className={styles.onlineImage}
                        />
                        <h3>Mua sắm trực tuyến</h3>
                        <p>Website GeGTNarVN</p>
                        <ul>
                            <li>www.gtn.com</li>
                            <li>Miễn phí giao hàng toàn quốc</li>
                        </ul>
                        <button className={styles.buyButton}>MUA NGAY</button>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default GioiThieu;