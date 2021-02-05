import { GetStaticProps, NextPage } from "next";
import Link from "next/link";
import { I18nProps } from "next-rosetta";
import { genAuthenticationClient, genTruckClient } from "services/backend/apiClients";
import { emptyPageResult } from "services/backend/ext/IPageResult";
import { AssignTokenCommand, TruckInfoIdDto } from "services/backend/nswagts";

type Props = {
  truckIds: number[];
};

const LocalePage: NextPage<Props> = ({ truckIds }) => {
  return (
    <div>
      Click the Truck ID to get to that truck page.
      <br />
      (This is temporary until the trucker user redirect is done)
      {truckIds.map(id => (
        <div key={id}>
          <Link href="/mytruck/[id]" as={"/mytruck/" + id}>
            <a>{id}</a>
          </Link>
        </div>
      ))}
    </div>
  );
};

export const getStaticProps: GetStaticProps<Props & I18nProps<Locale>> = async context => {
  const locale = context.locale || context.defaultLocale;
  const { table = {} } = await import(`../../i18n/${locale}`);

  const auth = await genAuthenticationClient();
  const { token } = await auth.login(
    new AssignTokenCommand({
      userDto: {
        username: "Admin",
        password: "Admin"
      }
    })
  );
  process.env.AUTH_TOKEN = token;

  const client = await genTruckClient();
  const trucks = await client.getTrucks().catch(() => emptyPageResult<TruckInfoIdDto>());
  const truckIds = trucks.results?.map(x => x.id);

  return { props: { table, truckIds }, revalidate: 600 };
};

export default LocalePage;
